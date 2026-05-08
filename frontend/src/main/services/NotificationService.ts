// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

import { IpcServerPushChannel } from '@shared/ipc-server-push-channel'
import { BrowserWindow, Notification as ElectronNotificationApp } from 'electron'
import { Notification } from 'src/renderer/src/types/notification'
import { ProactiveSuggestion, ProactiveSuggestionResponse } from 'src/renderer/src/types/proactive-suggestion'

class NotificationService {
  private window: BrowserWindow
  private lastAction: 'accept' | 'reject' = 'accept'
  private pendingSuggestionId: string | null = null

  constructor(window: BrowserWindow) {
    this.window = window
  }

  async sendNotification(notification: Notification) {
    const electronNotification = new ElectronNotificationApp({
      title: notification.title,
      body: notification.message
    })

    electronNotification.on('click', () => {
      this.window.show()
      this.window.webContents.send(IpcServerPushChannel.NotificationClick, notification)
    })

    electronNotification.show()
  }

  async sendProactiveSuggestion(suggestion: ProactiveSuggestion): Promise<void> {
    this.pendingSuggestionId = suggestion.id

    const notification = new ElectronNotificationApp({
      title: `💡 ${suggestion.title || 'Smart Tip'}`,
      body: suggestion.content,
      actions: [
        { type: 'button', text: 'Accept' },
        { type: 'button', text: 'Reject' }
      ],
      hasReply: true,
      replyPlaceholder: 'Optional: Add your reason...'
    })

    notification.on('action', (_event, index) => {
      this.lastAction = index === 0 ? 'accept' : 'reject'
      // If no reply is provided, send response immediately
      this.handleResponse(suggestion.id, this.lastAction, undefined)
    })

    notification.on('reply', (_event, reply) => {
      // User provided a reason with the reply
      this.handleResponse(suggestion.id, this.lastAction, reply)
    })

    notification.on('click', () => {
      this.window.show()
    })

    notification.on('close', () => {
      this.pendingSuggestionId = null
    })

    notification.show()
  }

  private handleResponse(suggestionId: string, action: 'accept' | 'reject', reason?: string): void {
    const response: ProactiveSuggestionResponse = {
      suggestionId,
      action,
      reason,
      timestamp: Date.now()
    }

    // Send response to renderer process
    this.window.webContents.send(IpcServerPushChannel.ProactiveSuggestion_Response, response)
    this.pendingSuggestionId = null
  }
}

export { NotificationService }
