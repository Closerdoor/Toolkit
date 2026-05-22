export type ReferenceItem = {
  id: string
  name: string
  url: string
  category: '综合工具站' | '开发工具' | '图片工具' | '生活工具' | 'AI 工具' | '设计参考'
  tags: string[]
  usage: string[]
  relatedTools: string[]
  note: string
}

export const references: ReferenceItem[] = [
  {
    id: 'jsontop',
    name: 'JSONTop',
    url: 'https://jsontop.cn/index.html',
    category: '综合工具站',
    tags: ['纯前端', '开发工具', '生活工具'],
    usage: ['功能参考', '信息架构参考', '待复刻'],
    relatedTools: ['json-formatter', 'timestamp', 'qrcode'],
    note: '偏自用工具集合气质，适合参考“纯前端、无注册、快速打开即用”的方向。',
  },
  {
    id: 'runjs-cool',
    name: 'RunJS Cool',
    url: 'https://www.runjs.cool/',
    category: '开发工具',
    tags: ['前端', '代码工具', '图片工具', '导航'],
    usage: ['功能参考', '工具清单参考'],
    relatedTools: ['qrcode', 'color-converter'],
    note: '一站式前端开发工具集合，工具种类很丰富，适合作为后续前端类工具扩展清单。',
  },
  {
    id: 'it-tools',
    name: 'IT Tools',
    url: 'https://it-tools.tech/',
    category: '开发工具',
    tags: ['开发者工具', '开源', '工具集合'],
    usage: ['功能参考', '交互参考', '视觉参考'],
    relatedTools: ['json-formatter', 'base64', 'url-codec', 'hash', 'regex-tester', 'timestamp', 'uuid', 'qrcode'],
    note: '开发者在线工具站的成熟样本，适合重点观察工具页布局、侧边导航、搜索和信息密度。',
  },
  {
    id: 'anakin-discover',
    name: 'Anakin AI Discover',
    url: 'https://app.anakin.ai/discover',
    category: 'AI 工具',
    tags: ['AI 应用', '发现页', '卡片布局'],
    usage: ['视觉参考', '信息架构参考'],
    relatedTools: [],
    note: 'AI 应用发现页，适合参考大量工具/应用的卡片组织、分类浏览和发现体验。',
  },
  {
    id: 'json-cn',
    name: 'JSON.cn',
    url: 'https://www.json.cn/',
    category: '开发工具',
    tags: ['JSON', '格式化', '校验'],
    usage: ['功能参考', '待复刻'],
    relatedTools: ['json-formatter'],
    note: 'JSON 相关能力完整，适合作为格式化、压缩、校验体验的参考。',
  },
  {
    id: 'bejson',
    name: 'BEJSON',
    url: 'https://www.bejson.com/',
    category: '综合工具站',
    tags: ['开发', '编码', '转换'],
    usage: ['功能参考'],
    relatedTools: ['json-formatter', 'base64', 'url-codec'],
    note: '覆盖面很广，可以作为后续工具清单扩展的来源。',
  },
  {
    id: 'regex101',
    name: 'Regex101',
    url: 'https://regex101.com/',
    category: '开发工具',
    tags: ['正则', '测试', '匹配'],
    usage: ['交互参考'],
    relatedTools: ['regex-tester'],
    note: '正则匹配反馈清晰，适合参考其测试和结果呈现方式。',
  },
  {
    id: 'cyberchef',
    name: 'CyberChef',
    url: 'https://gchq.github.io/CyberChef/',
    category: '综合工具站',
    tags: ['编码', 'Hash', '转换'],
    usage: ['功能参考', '交互参考'],
    relatedTools: ['hash', 'base64', 'url-codec'],
    note: '工具组合思路很强，后续可以参考它的流水线式操作。',
  },
  {
    id: 'tiny-png',
    name: 'TinyPNG',
    url: 'https://tinypng.com/',
    category: '图片工具',
    tags: ['图片', '压缩'],
    usage: ['待复刻'],
    relatedTools: [],
    note: '图片压缩体验简洁，适合作为未来图片类工具的参考。',
  },
  {
    id: 'cli-im',
    name: '草料二维码',
    url: 'https://cli.im/',
    category: '生活工具',
    tags: ['二维码', '生成'],
    usage: ['功能参考'],
    relatedTools: ['qrcode'],
    note: '二维码生成的输入、预览、下载流程值得参考。',
  },
]
