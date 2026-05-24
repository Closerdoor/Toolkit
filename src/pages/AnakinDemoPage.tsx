import { useMemo, useState } from 'react'
import {
  Bot,
  ChevronDown,
  Copy,
  CopyPlus,
  FileText,
  Flame,
  Languages,
  PenLine,
  Play,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react'

const tabs = [
  '推荐',
  'AI 模型',
  '写作',
  '文案',
  '图像生成',
  '电商',
  '外贸',
  '职业',
  '编程',
  '办公',
  '通用',
  '生活',
  '翻译',
  '游戏',
  '情感',
  '教育',
  '销售',
  '娱乐',
]

const demoApps = [
  {
    name: 'DeepSeek',
    description: 'DeepSeek 是一家专注实现 AGI 的中国人工智能公司，适合对话、写作、代码与知识问答。',
    tags: ['对话智能体', 'AI 模型'],
    category: 'AI 模型',
    count: 13594,
    tone: 'purple',
    icon: Bot,
  },
  {
    name: 'AI 生成图片',
    description: '输入描述即可生成高质量图片，适合海报、头像、视觉素材和创意探索。',
    tags: ['快捷应用', '图像生成'],
    category: '图像生成',
    count: 6862,
    tone: 'blue',
    icon: Sparkles,
  },
  {
    name: '论文润色',
    description: '修正语法、拼写错误，并优化句子结构，让论文表达更流畅易读。',
    tags: ['快捷应用', '写作'],
    category: '写作',
    count: 327,
    tone: 'pink',
    icon: PenLine,
  },
  {
    name: '短视频口播文案',
    description: '创意无限，定制独特的短视频口播文案，让你的视频走心而不平庸。',
    tags: ['快捷应用', '文案'],
    category: '文案',
    count: 271,
    tone: 'orange',
    icon: FileText,
  },
  {
    name: '跨境商品标题优化',
    description: '根据平台规则生成更易搜索的商品标题，兼顾关键词、卖点和阅读体验。',
    tags: ['快捷应用', '电商'],
    category: '电商',
    count: 914,
    tone: 'green',
    icon: Flame,
  },
  {
    name: '英文邮件翻译',
    description: '把中文邮件转成自然得体的英文表达，适合外贸沟通、求职和商务协作。',
    tags: ['快捷应用', '外贸'],
    category: '外贸',
    count: 1520,
    tone: 'cyan',
    icon: Languages,
  },
  {
    name: 'React 组件生成器',
    description: '描述目标功能后生成组件草稿，包含 props、状态和基础交互结构。',
    tags: ['快捷应用', '编程'],
    category: '编程',
    count: 743,
    tone: 'indigo',
    icon: CopyPlus,
  },
  {
    name: '会议纪要整理',
    description: '把杂乱记录整理成摘要、待办、负责人和时间线，适合日常办公复盘。',
    tags: ['快捷应用', '办公'],
    category: '办公',
    count: 1188,
    tone: 'slate',
    icon: FileText,
  },
]

export function AnakinDemoPage() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [query, setQuery] = useState('')

  const filteredApps = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return demoApps.filter((app) => {
      const matchTab = activeTab === '推荐' || app.category === activeTab || app.tags.includes(activeTab)
      const searchable = [app.name, app.description, app.category, ...app.tags].join(' ').toLowerCase()
      return matchTab && (!normalized || searchable.includes(normalized))
    })
  }, [activeTab, query])

  return (
    <main className="anakin-demo">
      <section className="anakin-search-banner">
        <div className="anakin-locale">简体中文</div>
        <h1>Discover AI Apps</h1>
        <p>Explore useful AI agents and workflows.</p>
        <div className="anakin-search">
          <Search size={18} />
          <input
            value={query}
            placeholder="搜索"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button">搜索</button>
        </div>
      </section>

      <section className="anakin-tabs" aria-label="应用频道">
        <div className="anakin-tabs-nav" role="tablist">
          <div className="anakin-tabs-wrap">
            <div className="anakin-tabs-list">
              {tabs.map((tab) => (
                <button
                  aria-selected={activeTab === tab}
                  className={`anakin-tab ${activeTab === tab ? 'active' : ''}`}
                  key={tab}
                  role="tab"
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="anakin-tab-label">{tab}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="anakin-tabs-language" type="button">
            简体中文
          </button>
        </div>
      </section>

      <section className="anakin-card-grid">
        {filteredApps.map((app) => {
          const Icon = app.icon
          return (
            <article className="anakin-card" key={app.name}>
              <div className="anakin-card-top">
                <div className={`anakin-avatar ${app.tone}`}>
                  <Icon size={22} />
                </div>
                <div className="anakin-copy-count" title="复制次数">
                  <Share2 size={13} />
                  <span>{app.count}</span>
                </div>
              </div>
              <div className="anakin-card-meta">
                <h2>{app.name}</h2>
                <p>{app.description}</p>
              </div>
              <div className="anakin-card-tags">
                {app.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="anakin-hover-actions">
                <button className="anakin-use-button" type="button">
                  <Play size={14} fill="currentColor" />
                  <span>立即使用</span>
                </button>
                <div className="anakin-clone-group">
                  <button className="anakin-clone-button" type="button">
                    <Copy size={14} />
                    <span>克隆并修改</span>
                  </button>
                  <button className="anakin-more-button" type="button" aria-label="更多克隆选项">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
