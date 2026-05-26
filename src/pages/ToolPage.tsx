import { Link, Navigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { ToolSidebar } from '../components/ToolSidebar'
import { findToolGroup, getToolsForGroup } from '../data/toolGroups'
import { getToolById } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Props = {
  theme: 'light' | 'dark'
  onToggleTheme: (theme: 'light' | 'dark') => void
}

const expansiveToolIds = new Set([
  'json-formatter',
  'html-preview',
  'code-formatter',
  'regex-tester',
  'regex-replace',
  'text-diff',
  'markdown-preview',
  'json-to-ts',
  'json-to-rust',
  'json-path',
  'json-viewer',
  'json-diff',
  'json-to-xml',
  'yaml-json',
  'sql-formatter',
  'xml-formatter',
  'xml-json',
  'toml-json',
  'html-to-markdown',
  'markdown-to-html',
  'svg-to-react',
  'docker-run-compose',
  'svg-placeholder',
  'safelink-decoder',
  'svg-workflow',
  'code-to-image',
  'image-crop',
  'subtitle-screenshot',
])

export function ToolPage({ theme, onToggleTheme }: Props) {
  const { toolId } = useParams()
  const tool = getToolById(toolId)
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolkit-favorite-tools', [])
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('toolkit-tool-sidebar-collapsed', false)

  if (!tool) return <Navigate to="/" replace />

  const ToolComponent = tool.component
  const isFavorite = favorites.includes(tool.id)
  const currentGroup = findToolGroup(tool.id)
  const groupTools = currentGroup ? getToolsForGroup(currentGroup) : []
  const toolIndex = groupTools.findIndex((item) => item.id === tool.id)
  const previousTool = toolIndex > 0 ? groupTools[toolIndex - 1] : undefined
  const nextTool = toolIndex >= 0 && toolIndex < groupTools.length - 1 ? groupTools[toolIndex + 1] : undefined
  const isExpansive = expansiveToolIds.has(tool.id)

  return (
    <main className={`tool-detail-page ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-open'} ${isExpansive ? 'expansive' : 'compact'}`}>
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
              <p className="eyebrow">{currentGroup?.label ?? tool.category}</p>
              <h1>{tool.name}</h1>
              <p className="lede">{tool.description}</p>
              {(previousTool || nextTool) && (
                <div className="tool-neighbor-links">
                  {previousTool && <Link to={previousTool.path}>← {previousTool.name}</Link>}
                  {nextTool && <Link to={nextTool.path}>{nextTool.name} →</Link>}
                </div>
              )}
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
