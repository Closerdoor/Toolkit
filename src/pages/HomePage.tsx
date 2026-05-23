import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ToolCard } from '../components/ToolCard'
import { catalogTools, categories, tools, type ToolItem } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

type ToolChannel = {
  label: string
  match: (tool: ToolItem) => boolean
}

const toolChannels: ToolChannel[] = [
  { label: '推荐', match: () => true },
  { label: 'AI模型', match: (tool) => tool.category === '视觉图片' || tool.tags.some((tag) => ['图片', '生成', '二维码'].includes(tag)) },
  { label: '写作', match: (tool) => tool.category === '文本编码' || tool.tags.some((tag) => ['文本', 'Markdown', '清理'].includes(tag)) },
  { label: '文案', match: (tool) => tool.category === '文本编码' || tool.tags.some((tag) => ['文案', '文本', '大小写'].includes(tag)) },
  { label: '图像生成', match: (tool) => tool.category === '视觉图片' },
  { label: '电商', match: (tool) => tool.category === '生活实用' || tool.tags.some((tag) => ['价格', '折扣', '清单'].includes(tag)) },
  { label: '外贸', match: (tool) => tool.category === '文本编码' || tool.tags.some((tag) => ['单位', '汇率', '时间'].includes(tag)) },
  { label: '开发', match: (tool) => tool.category === '开发工具' },
  { label: '效率', match: (tool) => tool.category === '生活实用' || tool.tags.some((tag) => ['时间', '待办', '随机'].includes(tag)) },
  { label: '生活', match: (tool) => tool.category === '生活实用' },
]

export function HomePage() {
  const [query, setQuery] = useState('')
  const [channel, setChannel] = useState(toolChannels[0].label)
  const [recent, setRecent] = useLocalStorage<string[]>('toolkit-recent-tools', [])

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const activeChannel = toolChannels.find((item) => item.label === channel) ?? toolChannels[0]
    return catalogTools.filter((tool) => {
      const searchable = [tool.name, tool.description, tool.category, ...tool.keywords, ...tool.tags].join(' ').toLowerCase()
      return activeChannel.match(tool) && (!normalized || searchable.includes(normalized))
    })
  }, [channel, query])

  const recentTools = recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean).slice(0, 4)

  const rememberTool = (id: string) => {
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 8))
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Personal utility workspace</p>
          <h1>ToolKit</h1>
          <p className="lede">
            一个自用优先的工具站，把常见开发工具、生活小工具和未来想复刻的灵感统一收纳起来，减少搜索、试错和忍受糟糕体验的时间。
          </p>
        </div>
        <div className="stats-strip">
          <div className="stat">
            <strong>{catalogTools.length}</strong>
            <span>收录工具</span>
          </div>
          <div className="stat">
            <strong>{categories.length}</strong>
            <span>分类</span>
          </div>
          <div className="stat">
            <strong>本地</strong>
            <span>优先处理</span>
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-box">
          <Search size={18} />
          <input className="input" placeholder="搜索 JSON、Base64、正则、二维码..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="category-tabs" role="tablist" aria-label="工具频道">
          {toolChannels.map((item) => (
            <button
              aria-selected={channel === item.label}
              className={`category-tab ${channel === item.label ? 'active' : ''}`}
              key={item.label}
              role="tab"
              type="button"
              onClick={() => setChannel(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {recentTools.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2>最近使用</h2>
          <div className="tool-grid">
            {recentTools.map((tool) => tool && <ToolCard key={tool.id} tool={tool} onOpen={rememberTool} />)}
          </div>
        </section>
      )}

      <section>
        <h2>{channel}工具</h2>
        {filteredTools.length > 0 ? (
          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onOpen={rememberTool} />
            ))}
          </div>
        ) : (
          <div className="empty-state">暂时没有匹配的工具。</div>
        )}
      </section>
    </main>
  )
}
