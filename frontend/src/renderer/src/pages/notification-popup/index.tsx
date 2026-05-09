import { useEffect, useState } from 'react'

const POPUP_RESPONSE_CHANNEL = 'popup:suggestion-response'

// Read suggestion data from URL query params (passed by main process)
function getSuggestionFromURL() {
  const hash = window.location.hash // e.g. #/notification-popup?id=...
  const qIndex = hash.indexOf('?')
  if (qIndex === -1) return null
  const params = new URLSearchParams(hash.slice(qIndex + 1))
  const id = params.get('id')
  if (!id) return null
  return {
    id,
    title: params.get('title') || 'Smart Tip',
    content: params.get('content') || ''
  }
}

export default function NotificationPopup() {
  const suggestion = getSuggestionFromURL()
  const [showReason, setShowReason] = useState(false)
  const [reason, setReason] = useState('')
  const [dismissed, setDismissed] = useState(false)

  // Make body transparent so the BrowserWindow transparent setting takes effect
  useEffect(() => {
    document.documentElement.style.background = 'transparent'
    document.body.style.background = 'transparent'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'
  }, [])

  if (!suggestion) return null

  const send = (payload: unknown) =>
    window.electron?.ipcRenderer.send(POPUP_RESPONSE_CHANNEL, payload)

  const close = () => {
    setDismissed(true)
    setTimeout(() => send(null), 200)
  }

  const respond = (action: 'accept' | 'reject', r?: string) => {
    setDismissed(true)
    setTimeout(() => send({ suggestionId: suggestion.id, action, reason: r || undefined, timestamp: Date.now() }), 200)
  }

  const handleReject = () => {
    if (showReason) respond('reject', reason)
    else setShowReason(true)
  }

  return (
    <>
      {/* CSS for -webkit-app-region — must be a real CSS string, not inline style */}
      <style>{`
        html, body { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }
        .drag-region { -webkit-app-region: drag; cursor: grab; }
        .no-drag { -webkit-app-region: no-drag; cursor: default; }
        .btn { -webkit-app-region: no-drag; cursor: pointer; border: none; font-weight: 600; font-size: 12.5px; padding: 7px 0; border-radius: 8px; }
        .btn-accept { background: #2563eb; color: #fff; }
        .btn-reject { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.18) !important; }
        textarea { -webkit-app-region: no-drag; }
        button { -webkit-app-region: no-drag; }
      `}</style>

      <div
        className="drag-region"
        style={{
          opacity: dismissed ? 0 : 1,
          transform: dismissed ? 'translateX(20px)' : 'translateX(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          background: 'rgba(24, 24, 26, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.14)',
          padding: '14px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          color: '#fff',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Header */}
        <div className="drag-region" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 15, marginRight: 6 }}>💡</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: '#f0f0f0', flex: 1 }}>
            {suggestion.title}
          </span>
          <button
            className="no-drag"
            onClick={close}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontSize: 15, lineHeight: 1,
              padding: '2px 4px', borderRadius: 4
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <p
          className="drag-region"
          style={{
            fontSize: 12.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.82)',
            margin: '0 0 14px 0', maxHeight: 100, overflow: 'auto',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}
        >
          {suggestion.content}
        </p>

        {/* Reason input */}
        {showReason && (
          <textarea
            className="no-drag"
            autoFocus
            placeholder="理由（可选）..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box', marginBottom: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, color: '#fff', fontSize: 12, padding: '8px 10px',
              resize: 'none', height: 60, outline: 'none', fontFamily: 'inherit'
            }}
          />
        )}

        {/* Buttons */}
        <div className="no-drag" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-accept no-drag" style={{ flex: 1 }} onClick={() => respond('accept')}>
            接受
          </button>
          <button className="btn btn-reject no-drag" style={{ flex: 1 }} onClick={handleReject}>
            {showReason ? '确认拒绝' : '拒绝'}
          </button>
        </div>
      </div>
    </>
  )
}
