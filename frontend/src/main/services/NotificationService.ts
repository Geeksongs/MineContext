// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

import { IpcServerPushChannel } from '@shared/ipc-server-push-channel'
import { BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'node:path'
import { Notification } from 'src/renderer/src/types/notification'
import { ProactiveSuggestion, ProactiveSuggestionResponse } from 'src/renderer/src/types/proactive-suggestion'

const POPUP_WIDTH = 364
const POPUP_HEIGHT = 240

// CSS injected into the popup window after load to ensure transparency.
// insertCSS runs in the renderer context with the highest priority.
const POPUP_CSS =
  'html,body,#root,#spinner{background:transparent!important;margin:0!important;padding:0!important;}' +
  '#spinner{display:none!important;}' +
  'body{overflow:hidden!important;}'

class NotificationService {
  private window: BrowserWindow
  private popupWindow: BrowserWindow | null = null

  constructor(window: BrowserWindow) {
    this.window = window
  }

  async sendNotification(notification: Notification) {
    const { Notification: ElectronNotification } = await import('electron')
    const n = new ElectronNotification({
      title: notification.title,
      body: notification.message
    })
    n.on('click', () => {
      this.window.show()
      this.window.webContents.send(IpcServerPushChannel.NotificationClick, notification)
    })
    n.show()
  }

  async sendProactiveSuggestion(suggestion: ProactiveSuggestion): Promise<void> {
    if (this.popupWindow && !this.popupWindow.isDestroyed()) {
      this.popupWindow.close()
    }

    const { workAreaSize } = screen.getPrimaryDisplay()
    const x = workAreaSize.width - POPUP_WIDTH - 16
    const y = 16

    this.popupWindow = new BrowserWindow({
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      x,
      y,
      show: false,              // hidden until CSS is injected — prevents white flash
      frame: false,
      transparent: true,        // enables per-pixel transparency
      // backgroundColor must be omitted or '#00000000' when transparent:true
      // so the OS composites the window as transparent
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      // 'panel' is NOT valid on macOS in Electron 36+; omit type entirely.
      // To avoid stealing focus, we use showInactive() below.
      hasShadow: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    // Float above full-screen apps as well
    this.popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })

    // Pass data via hash query-params — available immediately on component mount,
    // no IPC timing issues.
    const params = new URLSearchParams({
      id: suggestion.id,
      title: suggestion.title || '',
      content: suggestion.content || ''
    }).toString()
    const hash = `/notification-popup?${params}`

    if (process.env['ELECTRON_RENDERER_URL']) {
      await this.popupWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${hash}`)
    } else {
      await this.popupWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash })
    }

    // Insert CSS after page load to force transparency and hide the spinner.
    // webContents.insertCSS() is a valid Electron API that injects a stylesheet
    // into the loaded page's document. It returns a key string (unused here).
    await this.popupWindow.webContents.insertCSS(POPUP_CSS)

    // Show WITHOUT stealing focus from whatever the user is working in
    this.popupWindow.showInactive()

    // Handle user response sent from the popup renderer
    const responseHandler = (_: Electron.IpcMainEvent, response: ProactiveSuggestionResponse | null) => {
      if (this.popupWindow && !this.popupWindow.isDestroyed()) {
        this.popupWindow.close()
        this.popupWindow = null
      }
      if (response) {
        this.window.webContents.send(IpcServerPushChannel.ProactiveSuggestion_Response, response)
      }
      ipcMain.removeListener('popup:suggestion-response', responseHandler)
    }
    ipcMain.on('popup:suggestion-response', responseHandler)
  }
}

export { NotificationService }
