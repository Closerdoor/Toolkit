import { tools } from './tools'
import type { ToolItem } from './tools'

export type ToolGroup = {
  id: string
  label: string
  toolIds: string[]
}

export const toolNavigationGroups: ToolGroup[] = [
  {
    id: 'development',
    label: '开发',
    toolIds: [
      'json-formatter',
      'regex-tester',
      'regex-replace',
      'cron-parser',
      'sql-formatter',
      'json-path',
      'json-viewer',
      'json-diff',
      'json-to-xml',
      'json-to-ts',
      'json-to-rust',
      'code-formatter',
      'text-diff',
      'svg-to-react',
      'port-notes',
      'random-port',
      'chmod-calculator',
      'xml-formatter',
      'regex-cheatsheet',
      'keycode-info',
      'device-information',
      'docker-run-compose',
    ],
  },
  {
    id: 'encoding-conversion',
    label: '编码与转换',
    toolIds: [
      'base64',
      'image-base64',
      'url-codec',
      'html-entity',
      'case-converter',
      'integer-base-converter',
      'roman-numeral',
      'nato-alphabet',
      'timestamp',
      'yaml-json',
      'html-to-markdown',
      'markdown-to-html',
      'color-converter',
      'unit-converter',
      'list-converter',
      'json-to-csv',
      'text-binary',
      'text-unicode',
      'xml-json',
      'toml-json',
    ],
  },
  {
    id: 'crypto-security',
    label: '加密与安全',
    toolIds: [
      'token-generator',
      'hash',
      'crypto-tool',
      'hmac-generator',
      'password-generator',
      'password-strength',
      'uuid',
      'ulid',
      'jwt-decoder',
      'jwt-signer',
      'basic-auth',
      'random-string',
    ],
  },
  {
    id: 'text',
    label: '文本',
    toolIds: [
      'markdown-preview',
      'text-cleaner',
      'text-stats',
      'emoji-picker',
      'lorem-ipsum',
      'string-obfuscator',
      'ascii-art',
      'slugify',
      'numeronym',
    ],
  },
  {
    id: 'images-design',
    label: '图片与设计',
    toolIds: [
      'qrcode',
      'qr-decode',
      'wifi-qr',
      'svg-placeholder',
      'image-compressor',
      'image-resizer',
      'image-crop',
      'image-format-converter',
      'long-image',
      'placeholder-image',
      'nine-grid',
      'meme-generator',
      'cover-creator',
      'subtitle-screenshot',
      'favicon-generator',
      'gradient-generator',
      'svg-workflow',
      'code-to-image',
      'sprite-selector',
    ],
  },
  {
    id: 'web',
    label: 'Web',
    toolIds: ['url-params', 'user-agent-parser', 'html-preview', 'mime-lookup', 'http-status', 'meta-tag-generator', 'keycode-info', 'device-information'],
  },
  {
    id: 'network',
    label: '网络',
    toolIds: ['ip-cidr', 'ipv4-range', 'mac-generator'],
  },
  {
    id: 'math-measurement',
    label: '数学与单位',
    toolIds: [
      'unit-converter',
      'currency-converter',
      'bmi-calculator',
      'loan-calculator',
      'percentage-calculator',
      'roman-numeral',
      'countdown',
      'workday-calculator',
      'anniversary',
    ],
  },
  {
    id: 'workspace',
    label: '效率与生活',
    toolIds: [
      'random-picker',
      'group-splitter',
      'snippet-library',
      'personal-links',
      'tool-request-pool',
      'local-notes',
      'inspiration-analysis',
    ],
  },
  {
    id: 'games',
    label: '游戏娱乐',
    toolIds: [
      'math-adventure',
      'number-slide-puzzle',
      'infinite-shooting',
      'infinite-defense',
      'glyph-caster',
      'path-architect',
      'sphere-engineer-classic',
      'sphere-engineer-enhanced',
    ],
  },
]

export function getToolsForGroup(group: ToolGroup) {
  const byId = new Map(tools.map((tool) => [tool.id, tool]))
  return group.toolIds.map((id) => byId.get(id)).filter((tool): tool is ToolItem => Boolean(tool))
}

export function findToolGroup(toolId: string) {
  return toolNavigationGroups.find((group) => group.toolIds.includes(toolId))
}
