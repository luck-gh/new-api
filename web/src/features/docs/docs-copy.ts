/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { TFunction } from 'i18next'

import type { DocsEndpoint, DocsGuide } from './types'

export const GUIDE_GROUPS = [
  { source: '快速上手', labelKey: 'docs.groups.quickStart' },
  { source: '编程 CLI 工具', labelKey: 'docs.groups.cliTools' },
  { source: '客户端与工具', labelKey: 'docs.groups.clients' },
  { source: 'SDK 接入', labelKey: 'docs.groups.sdk' },
  { source: '故障排查', labelKey: 'docs.groups.troubleshooting' },
] as const

const GUIDE_COPY = {
  'quick-start': {
    title: 'docs.guides.quickStart.title',
    summary: 'docs.guides.quickStart.summary',
  },
  'image-gen': {
    title: 'docs.guides.imageGen.title',
    summary: 'docs.guides.imageGen.summary',
  },
  'cc-switch': {
    title: 'docs.guides.ccSwitch.title',
    summary: 'docs.guides.ccSwitch.summary',
  },
  'claude-code': {
    title: 'docs.guides.claudeCode.title',
    summary: 'docs.guides.claudeCode.summary',
  },
  'codex-cli': {
    title: 'docs.guides.codexCli.title',
    summary: 'docs.guides.codexCli.summary',
  },
  'cherry-studio': {
    title: 'docs.guides.cherryStudio.title',
    summary: 'docs.guides.cherryStudio.summary',
  },
  'immersive-translate': {
    title: 'docs.guides.immersiveTranslate.title',
    summary: 'docs.guides.immersiveTranslate.summary',
  },
  'openai-sdk': {
    title: 'docs.guides.openaiSdk.title',
    summary: 'docs.guides.openaiSdk.summary',
  },
  'anthropic-sdk': {
    title: 'docs.guides.anthropicSdk.title',
    summary: 'docs.guides.anthropicSdk.summary',
  },
  troubleshooting: {
    title: 'docs.guides.troubleshooting.title',
    summary: 'docs.guides.troubleshooting.summary',
  },
} as const

const ENDPOINT_TITLE_KEYS = [
  'docs.endpoints.listModels',
  'docs.endpoints.getModel',
  'docs.endpoints.chatCompletions',
  'docs.endpoints.responses',
  'docs.endpoints.compactResponse',
  'docs.endpoints.claudeMessages',
  'docs.endpoints.completions',
  'docs.endpoints.embeddings',
  'docs.endpoints.rerank',
  'docs.endpoints.moderations',
  'docs.endpoints.createSpeech',
  'docs.endpoints.transcriptions',
  'docs.endpoints.translations',
  'docs.endpoints.realtime',
  'docs.endpoints.imageGeneration',
  'docs.endpoints.imageEdits',
  'docs.endpoints.createVideo',
  'docs.endpoints.getVideo',
  'docs.endpoints.downloadVideo',
  'docs.endpoints.remixVideo',
  'docs.endpoints.geminiAction',
  'docs.endpoints.compatibility',
] as const

export function guideSlug(guide: DocsGuide) {
  return guide.route.slice(guide.route.lastIndexOf('/') + 1)
}

export function guideTitle(t: TFunction, guide: DocsGuide) {
  const copy = GUIDE_COPY[guideSlug(guide) as keyof typeof GUIDE_COPY]
  return copy ? t(copy.title, { defaultValue: guide.title }) : guide.title
}

export function guideSummary(t: TFunction, guide: DocsGuide) {
  const copy = GUIDE_COPY[guideSlug(guide) as keyof typeof GUIDE_COPY]
  return copy ? t(copy.summary, { defaultValue: guide.summary }) : guide.summary
}

export function endpointTitle(t: TFunction, endpoint: DocsEndpoint) {
  const index = Number(endpoint.id.replace('endpoint-', ''))
  const key = ENDPOINT_TITLE_KEYS[index]
  return key ? t(key, { defaultValue: endpoint.title }) : endpoint.title
}
