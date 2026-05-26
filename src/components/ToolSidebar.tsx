import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Search, Wrench } from 'lucide-react'
import { findToolGroup, getToolsForGroup, toolNavigationGroups } from '../data/toolGroups'

type Props = {
  collapsed: boolean
  theme: 'light' | 'dark'
  onCollapseChange: (collapsed: boolean) => void
  onToggleTheme: (theme: 'light' | 'dark') => void
}

export function ToolSidebar({ collapsed, theme, onCollapseChange, onToggleTheme }: Props) {
  const location = useLocation()
  const activeToolId = location.pathname.split('/').at(-1) ?? ''
  const activeGroup = findToolGroup(activeToolId)
  const [query, setQuery] = useState('')
  const [openGroups, setOpenGroups] = useState<string[]>(() => (activeGroup ? [activeGroup.id] : toolNavigationGroups.map((group) => group.id)))
  const contentRef = useRef<HTMLElement | null>(null)
  const lastScrollTopRef = useRef(0)
  const previousPathRef = useRef(location.pathname)
  const normalizedQuery = query.trim().toLowerCase()

  useLayoutEffect(() => {
    if (previousPathRef.current === location.pathname || !contentRef.current) return
    const scrollTop = lastScrollTopRef.current
    previousPathRef.current = location.pathname
    contentRef.current.scrollTop = scrollTop
    requestAnimationFrame(() => {
      if (contentRef.current) contentRef.current.scrollTop = scrollTop
    })
    window.setTimeout(() => {
      if (contentRef.current) contentRef.current.scrollTop = scrollTop
    }, 60)
  }, [location.pathname])

  const visibleGroups = useMemo(
    () =>
      toolNavigationGroups
        .map((group) => {
          const groupTools = getToolsForGroup(group)
          const visibleTools = normalizedQuery
            ? groupTools.filter((tool) =>
                [tool.name, tool.description, tool.category, ...tool.tags, ...tool.keywords].join(' ').toLowerCase().includes(normalizedQuery),
              )
            : groupTools
          return { group, tools: visibleTools }
        })
        .filter((item) => item.tools.length > 0),
    [normalizedQuery],
  )

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => (current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]))
  }

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
          <label className="tool-quick-search">
            <Search size={15} />
            <input value={query} placeholder="搜索工具" onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <nav
          className="tool-quick-content"
          ref={contentRef}
          onScroll={(event) => {
            lastScrollTopRef.current = event.currentTarget.scrollTop
          }}
        >
          {visibleGroups.map(({ group, tools }) => (
            <div className="tool-quick-group" key={group.id}>
              <button className="tool-quick-category" type="button" onClick={() => toggleGroup(group.id)}>
                <span>{group.label}</span>
                <ChevronDown className={openGroups.includes(group.id) || activeGroup?.id === group.id ? 'open' : ''} size={14} />
              </button>
              {(openGroups.includes(group.id) || activeGroup?.id === group.id || normalizedQuery) &&
                tools.map((tool) => {
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
