import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Wrench } from 'lucide-react'
import { getToolsForGroup, toolNavigationGroups } from '../data/toolGroups'

type Props = {
  collapsed: boolean
  theme: 'light' | 'dark'
  onCollapseChange: (collapsed: boolean) => void
  onToggleTheme: (theme: 'light' | 'dark') => void
}

export function ToolSidebar({ collapsed, theme, onCollapseChange, onToggleTheme }: Props) {
  return (
    <>
      <aside className={`tool-quick-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="工具快捷菜单">
        <div className="tool-quick-header">
          <NavLink className="tool-quick-brand" to="/">
            <span className="tool-quick-logo">
              <Wrench size={20} />
            </span>
            <span>ToolKit</span>
          </NavLink>
        </div>

        <nav className="tool-quick-content">
          {toolNavigationGroups.map((group) => (
            <div className="tool-quick-group" key={group.id}>
              <div className="tool-quick-category">{group.label}</div>
              {getToolsForGroup(group).map((tool) => {
                const Icon = tool.icon
                return (
                  <NavLink className="tool-quick-item" key={tool.id} to={tool.path}>
                    <Icon size={16} />
                    <span>{tool.name}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="tool-quick-footer">
          <div className="tool-quick-theme">
            <span>深色模式</span>
            <label className="tool-quick-switch">
              <input
                checked={theme === 'dark'}
                type="checkbox"
                onChange={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
              />
              <span />
            </label>
          </div>
          <button className="tool-quick-collapse" type="button" onClick={() => onCollapseChange(true)}>
            <ChevronLeft size={17} />
            <span>收起侧边栏</span>
          </button>
        </div>
      </aside>

      <button
        aria-label="展开工具快捷菜单"
        className={`tool-quick-expand ${collapsed ? 'visible' : ''}`}
        type="button"
        onClick={() => onCollapseChange(false)}
      >
        <ChevronRight size={18} />
      </button>

      <button
        aria-label="关闭工具快捷菜单"
        className={`tool-quick-overlay ${collapsed ? '' : 'visible'}`}
        type="button"
        onClick={() => onCollapseChange(true)}
      />
    </>
  )
}
