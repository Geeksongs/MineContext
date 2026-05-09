// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useMemo } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'

import HomePage from './pages/home/home-page'
import VaultPage from './pages/vault/Vault'
import ScreenMonitor from './pages/screen-monitor/screen-monitor'
import Settings from './pages/settings/settings'
import Files from './pages/files/Files'
import AIDemo from './pages/ai-demo/ai-demo'
import Sidebar from './components/Sidebar'
import NotificationPopup from './pages/notification-popup'
import 'allotment/dist/style.css'
import { useEvents } from './hooks/use-events'
import { useObservableTask } from './atom/event-loop.atom'
import { IpcServerPushChannel } from '@shared/ipc-server-push-channel'

// Lightweight component for the floating popup window — no polling, no sidebar
const PopupContent: FC = () => (
  <Routes>
    <Route path="/notification-popup" element={<NotificationPopup />} />
  </Routes>
)

const AppContent: FC = () => {
  const navigate = useNavigate()
  const { startPolling, stopPolling } = useEvents()
  useObservableTask({ active: startPolling, inactive: stopPolling })

  useEffect(() => {
    const go = () => navigate('/screen-monitor')
    window.electron.ipcRenderer.on(IpcServerPushChannel.Tray_NavigateToScreenMonitor, go)
    return () => { window.electron.ipcRenderer.removeListener(IpcServerPushChannel.Tray_NavigateToScreenMonitor, go) }
  }, [navigate])

  useEffect(() => {
    const toggle = () => navigate('/screen-monitor', { state: { toggleRecording: true } })
    window.electron.ipcRenderer.on(IpcServerPushChannel.Tray_ToggleRecording, toggle)
    return () => { window.electron.ipcRenderer.removeListener(IpcServerPushChannel.Tray_ToggleRecording, toggle) }
  }, [navigate])

  useEffect(() => {
    startPolling()
    return () => stopPolling()
  }, [])

  const routes = useMemo(() => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vault" element={<VaultPage />} />
      <Route path="/screen-monitor" element={<ScreenMonitor />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/files" element={<Files />} />
      <Route path="/ai-demo" element={<AIDemo />} />
    </Routes>
  ), [])

  return (
    <div
      className="flex h-screen"
      style={{
        height: '100vh',
        background: 'linear-gradient(165.9deg, #CEC1D2 -3.95%, #D9DAE8 3.32%, #F2F2F2 23.35%, #F2F0E6 71.67%, #F9FAED 76.64%, #FFEDDF 83.97%)'
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col pr-2">{routes}</div>
    </div>
  )
}

const Router: FC = () => {
  // Check before mounting any heavy components
  const isPopup = window.location.hash.startsWith('#/notification-popup')
  return (
    <HashRouter>
      {isPopup ? <PopupContent /> : <AppContent />}
    </HashRouter>
  )
}

export default Router
