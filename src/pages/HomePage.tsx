import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ToolCard } from '../components/ToolCard'
import { catalogTools, categories, tools, type ToolCategory } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ToolCategory | '全部'>('全部')
  const [recent, setRecent] = useLocalStorage<string[]>('toolkit-recent-tools', [])

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return catalogTools.filter((tool) => {
      const matchCategory = category === '全部' || tool.category === category
      const searchable = [tool.name, tool.description, tool.category, ...tool.keywords, ...tool.tags].join(' ').toLowerCase()
      return matchCategory && (!normalized || searchable.includes(normalized))
    })
  }, [category, query])

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
        <div className="category-tabs" role="tablist" aria-label="工具分类">
          {(['全部', ...categories] as const).map((item) => (
            <button
              aria-selected={category === item}
              className={`category-tab ${category === item ? 'active' : ''}`}
              key={item}
              role="tab"
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
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
        <h2>全部工具</h2>
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
