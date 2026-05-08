// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

export interface ProactiveSuggestion {
  id: string
  title: string
  content: string
}

export interface ProactiveSuggestionResponse {
  suggestionId: string
  action: 'accept' | 'reject'
  reason?: string
  timestamp: number
}
