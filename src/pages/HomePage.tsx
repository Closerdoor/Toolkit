import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MoreHorizontal, Search } from 'lucide-react'
import { ToolCard } from '../components/ToolCard'
import { toolNavigationGroups } from '../data/toolGroups'
import { catalogTools, type ToolItem } from '../data/tools'
import { useLocalStorage } from '../hooks/useLocalStorage'

type ToolChannel = {
  label: string
  match: (tool: ToolItem) => boolean
}

const toolChannels: ToolChannel[] = [
  { label: '推荐', match: () => true },
  ...toolNavigationGroups.map((group) => ({
    label: group.label,
    match: (tool: ToolItem) => group.toolIds.includes(tool.id),
  })),
]

function getChannelTabWidth(label: string) {
  if (label.length >= 5) return 104
  if (label.length >= 4) return 92
  return 64
}

function getVisibleChannelCount(availableWidth: number) {
  const tabWidths = toolChannels.map((item) => getChannelTabWidth(item.label))
  const totalWidth = tabWidths.reduce((sum, width) => sum + width, 0)
  const moreWidth = 64

  if (totalWidth <= availableWidth) return toolChannels.length

  const fitWidth = Math.max(0, availableWidth - moreWidth)
  let usedWidth = 0
  let visibleCount = 0

  for (const width of tabWidths) {
    if (usedWidth + width > fitWidth) break
    usedWidth += width
    visibleCount += 1
  }

  return Math.max(1, visibleCount)
}

export function HomePage() {
  const [query, setQuery] = useState('')
  const [channel, setChannel] = useState(toolChannels[0].label)
  const [moreOpen, setMoreOpen] = useState(false)
  const tabsWrapRef = useRef<HTMLDivElement>(null)
  const moreCloseTimerRef = useRef<number | null>(null)
  const [visibleChannelCount, setVisibleChannelCount] = useState(toolChannels.length)
  const [, setRecent] = useLocalStorage<string[]>('toolkit-recent-tools', [])
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolkit-favorite-tools', [])
  const visibleChannels = toolChannels.slice(0, visibleChannelCount)
  const overflowChannels = toolChannels.slice(visibleChannelCount)
  const activeOverflowChannel = overflowChannels.some((item) => item.label === channel)

  useLayoutEffect(() => {
    const tabsWrap = tabsWrapRef.current
    if (!tabsWrap) return

    const updateVisibleCount = () => {
      setVisibleChannelCount(getVisibleChannelCount(tabsWrap.clientWidth))
    }

    updateVisibleCount()

    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(tabsWrap)
    return () => observer.disconnect()
  }, [])

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const activeChannel = toolChannels.find((item) => item.label === channel) ?? toolChannels[0]
    return catalogTools.filter((tool) => {
      const searchable = [tool.name, tool.description, tool.category, ...tool.keywords, ...tool.tags].join(' ').toLowerCase()
      return activeChannel.match(tool) && (!normalized || searchable.includes(normalized))
    })
  }, [channel, query])

  const rememberTool = (id: string) => {
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 8))
  }

  const toggleFavorite = (id: string) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]))
  }

  const openMoreMenu = () => {
    if (moreCloseTimerRef.current) {
      window.clearTimeout(moreCloseTimerRef.current)
      moreCloseTimerRef.current = null
    }
    setMoreOpen(true)
  }

  const closeMoreMenuSoon = () => {
    if (moreCloseTimerRef.current) window.clearTimeout(moreCloseTimerRef.current)
    moreCloseTimerRef.current = window.setTimeout(() => {
      setMoreOpen(false)
      moreCloseTimerRef.current = null
    }, 180)
  }

  return (
    <main className="anakin-demo toolkit-home">
      <section className="anakin-search-banner">
        <div className="anakin-locale">简体中文</div>
        <h1>ToolKit</h1>
        <p>Explore personal utilities and local-first workflows.</p>
        <div className="anakin-search">
          <Search size={18} />
          <input
            value={query}
            placeholder="搜索 JSON、Base64、正则、二维码..."
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button">搜索</button>
        </div>
      </section>

      <section className="anakin-tabs" aria-label="工具频道">
        <div className="anakin-tabs-nav" role="tablist">
          <div className="anakin-tabs-wrap" ref={tabsWrapRef}>
            <div className="anakin-tabs-list">
              {visibleChannels.map((item) => (
                <button
                  aria-selected={channel === item.label}
                  className={`anakin-tab ${channel === item.label ? 'active' : ''}`}
                  key={item.label}
                  role="tab"
                  type="button"
                  onClick={() => {
                    setChannel(item.label)
                    setMoreOpen(false)
                  }}
                >
                  <span className="anakin-tab-label">{item.label}</span>
                </button>
              ))}
              {overflowChannels.length > 0 && (
                <div
                  className={`anakin-tab-more ${activeOverflowChannel ? 'active' : ''}`}
                  onMouseEnter={openMoreMenu}
                  onMouseLeave={closeMoreMenuSoon}
                >
                  <button
                    aria-expanded={moreOpen}
                    aria-haspopup="menu"
                    aria-label="更多频道"
                    className="anakin-tab-more-button"
                    type="button"
                    onFocus={openMoreMenu}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {moreOpen && (
                    <div className="anakin-tab-more-menu" role="menu" onMouseEnter={openMoreMenu}>
                      {overflowChannels.map((item) => (
                        <button
                          className={`anakin-tab-more-item ${channel === item.label ? 'active' : ''}`}
                          key={item.label}
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setChannel(item.label)
                            setMoreOpen(false)
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button className="anakin-tabs-language" type="button">
            简体中文
          </button>
        </div>
      </section>

      <section className="toolkit-home-results">
        {filteredTools.length > 0 ? (
          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <ToolCard
                isFavorite={favorites.includes(tool.id)}
                key={tool.id}
                tool={tool}
                onOpen={rememberTool}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">暂时没有匹配的工具。</div>
        )}
      </section>
    </main>
  )
}
