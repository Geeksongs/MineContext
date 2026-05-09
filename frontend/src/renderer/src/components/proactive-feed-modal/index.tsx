// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

import { Modal, Button } from '@arco-design/web-react'
import { FC, ReactNode } from 'react'
import { MarkdownContent } from '../ai-assistant'
import titleBg from './assets/bg.png'

type ResponseState = 'accepted' | 'rejected' | null

interface ProactiveFeedModalProps {
  visible: boolean
  onCancel: () => void
  content?: ReactNode
  time?: ReactNode
  // Accept / Reject props (optional — only passed for Tip cards)
  responded?: ResponseState
  onAccept?: () => void
  onReject?: () => void
  showReason?: boolean
  reason?: string
  onReasonChange?: (v: string) => void
}

const ProactiveFeedModal: FC<ProactiveFeedModalProps> = (props) => {
  const { visible, onCancel, content, responded, onAccept, onReject, showReason, reason, onReasonChange } = props
  const hasFeedback = onAccept !== undefined

  const modalHeader = (
    <div
      className={`bg-[url('${titleBg}')] !bg-no-repeat w-full h-[76px] !bg-cover !bg-center rounded-[8px] overflow-hidden flex items-center`}
      style={{ background: `url(${titleBg})` }}>
      <div className="ml-[118px]">
        <div className="text-[20px] leading-[22px] bg-[linear-gradient(271.9deg,_#C296FF_-23.68%,_#FF875F_100.99%)] bg-clip-text text-transparent font-bold">
          Proactive Feed
        </div>
        <div className="text-[12px] leading-[20px] text-[#6e718c]">Here are some insights you should know</div>
      </div>
    </div>
  )

  const modalContent = (
    <div className="mt-4 h-full overflow-x-hidden overflow-y-auto">
      <MarkdownContent content={String(content || ``)} />
    </div>
  )

  const modalFooter = (
    <div className="flex flex-col gap-2 p-4">
      {/* Accept / Reject section — only for Tip cards that haven't been responded to */}
      {hasFeedback && (
        <div className="w-full">
          {!responded ? (
            <>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onAccept}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
                    background: '#2563eb', color: '#fff', fontSize: 13,
                    fontWeight: 600, cursor: 'pointer'
                  }}>
                  接受
                </button>
                <button
                  onClick={onReject}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6,
                    border: '1px solid #d1d5db', background: 'transparent',
                    color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>
                  {showReason ? '确认拒绝' : '拒绝'}
                </button>
              </div>
              {showReason && (
                <textarea
                  autoFocus
                  placeholder="理由（可选）..."
                  value={reason}
                  onChange={e => onReasonChange?.(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginBottom: 8,
                    border: '1px solid #d1d5db', borderRadius: 6,
                    fontSize: 13, padding: '6px 10px', resize: 'none',
                    height: 60, outline: 'none', fontFamily: 'inherit'
                  }}
                />
              )}
            </>
          ) : (
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 8,
              color: responded === 'accepted' ? '#16a34a' : '#dc2626'
            }}>
              {responded === 'accepted' ? '✓ 已接受' : '✗ 已拒绝'}
            </div>
          )}
        </div>
      )}

      {/* I got it button always present */}
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={onCancel}
          className="flex w-[116px] px-4 py-[5px] justify-center items-center gap-2 rounded-md"
          style={{ backgroundColor: '#0B0B0F' }}>
          I got it
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      visible={visible}
      title={modalHeader}
      footer={modalFooter}
      onCancel={onCancel}
      className="!w-[700px] !h-[588px] [&_.arco-modal-header]:!h-auto [&_.arco-modal-header]:!px-0 px-[20px] pt-[16px] pb-[20px] [&_>_div]:nth-2:flex [&_>_div]:nth-2:flex-col [&_>_div]:nth-2:h-full [&_.arco-modal-content]:!flex-1 [&_.arco-modal-content]:!p-0 [&_.arco-modal-footer]:!p-0 [&_.arco-modal-content]:!overflow-y-hidden [&_.arco-modal-footer]:!h-auto"
      closable={false}
    >
      {modalContent}
    </Modal>
  )
}

export { ProactiveFeedModal }
