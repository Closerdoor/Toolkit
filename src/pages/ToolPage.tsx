import { Link, Navigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { ToolSidebar } from '../components/ToolSidebar'
import { references } from '../data/references'
import { getToolById } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function ToolPage() {
  const { toolId } = useParams()
  const tool = getToolById(toolId)
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolkit-favorite-tools', [])

  if (!tool) return <Navigate to="/" replace />

  const ToolComponent = tool.component
  const isFavorite = favorites.includes(tool.id)
  const relatedReferences = references.filter((reference) => tool.references.includes(reference.id))

  return (
    <main className="page">
      <div className="workbench">
        <ToolSidebar />

        <section className="tool-panel">
          <header className="tool-panel-header">
            <div>
              <p className="eyebrow">{tool.category}</p>
              <h1 style={{ fontSize: 34 }}>{tool.name}</h1>
              <p className="lede">{tool.description}</p>
            </div>
            <button
              className={`icon-button ${isFavorite ? 'active' : ''}`}
              type="button"
              title={isFavorite ? '取消收藏' : '收藏工具'}
              onClick={() =>
                setFavorites((current) =>
                  current.includes(tool.id) ? current.filter((id) => id !== tool.id) : [tool.id, ...current],
                )
              }
            >
              <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </header>
          <div className="tool-panel-body">
            <ToolComponent />
          </div>
        </section>

        <aside className="info-panel">
          <h3>工具说明</h3>
          <p>{tool.localOnly ? '当前工具在浏览器本地处理输入内容，不会上传到服务器。' : '当前工具可能需要调用外部服务。'}</p>
          <h3 style={{ marginTop: 18 }}>参考网页</h3>
          {relatedReferences.length > 0 ? (
            <ul>
              {relatedReferences.map((reference) => (
                <li key={reference.id}>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>暂未记录关联参考网页。</p>
          )}
          <p style={{ marginTop: 18 }}>
            <Link to="/references">查看全部参考网页</Link>
          </p>
        </aside>
      </div>
    </main>
  )
}
