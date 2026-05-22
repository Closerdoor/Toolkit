import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { references } from '../data/references'
import { tools } from '../data/tools'

const categories = ['全部', '综合工具站', '开发工具', '图片工具', '生活工具', 'AI 工具', '设计参考'] as const

export function ReferencesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('全部')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return references.filter((reference) => {
      const matchCategory = category === '全部' || reference.category === category
      const searchable = [reference.name, reference.url, reference.category, reference.note, ...reference.tags, ...reference.usage]
        .join(' ')
        .toLowerCase()
      return matchCategory && (!normalized || searchable.includes(normalized))
    })
  }, [category, query])

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Inspiration archive</p>
          <h1>参考网页</h1>
          <p className="lede">记录 ToolKit 的灵感来源、功能复刻对象、交互参考和之后想补齐的工具方向。</p>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-box">
          <Search size={18} />
          <input className="input" placeholder="搜索站点、标签、备注..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="category-row">
          {categories.map((item) => (
            <button className={`chip ${category === item ? 'active' : ''}`} key={item} type="button" onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="reference-grid">
        {filtered.map((reference) => {
          const relatedTools = reference.relatedTools
            .map((id) => tools.find((tool) => tool.id === id)?.name)
            .filter(Boolean)

          return (
            <article className="reference-card" key={reference.id}>
              <h2 style={{ fontSize: 19 }}>{reference.name}</h2>
              <p style={{ marginTop: 8 }}>
                <a href={reference.url} target="_blank" rel="noreferrer">
                  打开网页 <ExternalLink size={14} />
                </a>
              </p>
              <p className="muted" style={{ marginTop: 12 }}>
                {reference.note}
              </p>
              <div className="tag-list" style={{ marginTop: 14 }}>
                {[reference.category, ...reference.tags, ...reference.usage].map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {relatedTools.length > 0 && <p className="muted" style={{ marginTop: 12 }}>关联工具：{relatedTools.join('、')}</p>}
            </article>
          )
        })}
      </section>
    </main>
  )
}
