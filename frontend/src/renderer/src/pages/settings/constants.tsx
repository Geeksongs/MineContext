// Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react'
import openAI from '../../assets/images/settings/OpenAI.png'
import doubao from '../../assets/images/settings/doubao.png'
import claude from '../../assets/images/settings/claude.svg'
import gemini from '../../assets/images/settings/gemini.svg'
import deepseek from '../../assets/images/settings/deepseek.svg'
import qwen from '../../assets/images/settings/qwen.svg'
import custom from '../../assets/images/settings/custom.svg'

export enum ModelTypeList {
  Doubao = 'doubao',
  OpenAI = 'openai',
  Claude = 'claude',
  Gemini = 'gemini',
  DeepSeek = 'deepseek',
  Qwen = 'qwen',
  Custom = 'custom'
}

export enum embeddingModels {
  DoubaoEmbeddingModelId = 'doubao-embedding-vision-250615',
  OpenAIEmbeddingModelId = 'text-embedding-3-large',
  ClaudeEmbeddingModelId = 'text-embedding-3-large',
  GeminiEmbeddingModelId = 'text-embedding-004',
  DeepSeekEmbeddingModelId = 'text-embedding-3-large',
  QwenEmbeddingModelId = 'text-embedding-v3'
}
export enum BaseUrl {
  DoubaoUrl = 'https://ark.cn-beijing.volces.com/api/v3',
  OpenAIUrl = 'https://api.openai.com/v1',
  ClaudeUrl = 'https://api.anthropic.com/v1',
  GeminiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai',
  DeepSeekUrl = 'https://api.deepseek.com/v1',
  QwenUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
}
export interface OptionInfo {
  value: string
  label: string
}
export interface ModelInfo {
  icon: ReactNode
  key: string
  value: string
  option?: OptionInfo[]
}

export const ModelInfoList = [
  {
    icon: <img src={doubao} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'Doubao',
    value: 'doubao',
    option: [
      {
        value: 'doubao-seed-1-6-flash-250828',
        label: 'doubao-seed-1.6-flash'
      },
      {
        value: 'doubao-1-5-vision-pro-250328',
        label: 'doubao-1.5-vision-pro'
      },
      {
        value: 'doubao-1-5-vision-lite-250315',
        label: 'doubao-1.5-vision-lite'
      }
    ]
  },
  {
    icon: <img src={openAI} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'OpenAI',
    value: 'openai',
    option: [
      {
        value: 'gpt-5.5',
        label: 'GPT-5.5'
      },
      {
        value: 'gpt-5.4',
        label: 'GPT-5.4'
      },
      {
        value: 'gpt-5.4-mini',
        label: 'GPT-5.4 Mini'
      },
      {
        value: 'gpt-5.4-nano',
        label: 'GPT-5.4 Nano'
      },
      {
        value: 'gpt-5',
        label: 'GPT-5'
      },
      {
        value: 'gpt-5-mini',
        label: 'GPT-5 Mini'
      },
      {
        value: 'gpt-5-nano',
        label: 'GPT-5 Nano'
      },
      {
        value: 'o1',
        label: 'o1 (Reasoning)'
      },
      {
        value: 'o1-mini',
        label: 'o1 Mini'
      }
    ]
  },
  {
    icon: <img src={claude} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'Claude',
    value: 'claude',
    option: [
      {
        value: 'claude-opus-4.7',
        label: 'Claude Opus 4.7'
      },
      {
        value: 'claude-opus-4.5',
        label: 'Claude Opus 4.5'
      },
      {
        value: 'claude-sonnet-4',
        label: 'Claude Sonnet 4'
      },
      {
        value: 'claude-haiku-4',
        label: 'Claude Haiku 4'
      }
    ]
  },
  {
    icon: <img src={gemini} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'Gemini',
    value: 'gemini',
    option: [
      {
        value: 'gemini-3.1-pro',
        label: 'Gemini 3.1 Pro'
      },
      {
        value: 'gemini-3-pro',
        label: 'Gemini 3 Pro'
      },
      {
        value: 'gemini-3-flash',
        label: 'Gemini 3 Flash'
      },
      {
        value: 'gemini-2.5-pro',
        label: 'Gemini 2.5 Pro'
      }
    ]
  },
  {
    icon: <img src={deepseek} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'DeepSeek',
    value: 'deepseek',
    option: [
      {
        value: 'deepseek-v4-pro',
        label: 'DeepSeek V4 Pro'
      },
      {
        value: 'deepseek-v4',
        label: 'DeepSeek V4'
      },
      {
        value: 'deepseek-v4-flash',
        label: 'DeepSeek V4 Flash'
      },
      {
        value: 'deepseek-r1',
        label: 'DeepSeek R1 (Reasoning)'
      }
    ]
  },
  {
    icon: <img src={qwen} className="!max-w-none w-[24px] h-[24px]" />,
    key: 'Qwen',
    value: 'qwen',
    option: [
      {
        value: 'qwen-3.6-plus',
        label: 'Qwen 3.6 Plus'
      },
      {
        value: 'qwen-3',
        label: 'Qwen 3'
      },
      {
        value: 'qwen-3-turbo',
        label: 'Qwen 3 Turbo'
      },
      {
        value: 'qwen-vl-3',
        label: 'Qwen VL 3 (Vision)'
      }
    ]
  },
  {
    icon: <img src={custom} className="!max-w-none w-[18px] h-[18px]" />,
    key: 'Custom',
    value: 'custom'
  }
]
