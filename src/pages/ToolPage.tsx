import { Navigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { ToolSidebar } from '../components/ToolSidebar'
import { getToolById } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Props = {
  theme: 'light' | 'dark'
  onToggleTheme: (theme: 'light' | 'dark') => void
}

export function ToolPage({ theme, onToggleTheme }: Props) {
  const { toolId } = useParams()
  const tool = getToolById(toolId)
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolkit-favorite-tools', [])
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('toolkit-tool-sidebar-collapsed', false)

  if (!tool) return <Navigate to="/" replace />

  const ToolComponent = tool.component
  const isFavorite = favorites.includes(tool.id)

  return (
    <main className={`tool-detail-page ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-open'}`}>
      <ToolSidebar
        collapsed={sidebarCollapsed}
        theme={theme}
        onCollapseChange={setSidebarCollapsed}
        onToggleTheme={onToggleTheme}
      />
      <div className="tool-detail-workspace">
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
      </div>
    </main>
  )
}
