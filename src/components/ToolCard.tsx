import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import type { ToolItem } from '../data/tools'

type Props = {
  tool: ToolItem
  isFavorite?: boolean
  onOpen?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

export function ToolCard({ tool, isFavorite = false, onOpen, onToggleFavorite }: Props) {
  const Icon = tool.icon
  const tone = Math.abs([...tool.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 6

  return (
    <Link className={`tool-card tone-${tone}`} to={tool.path} onClick={() => onOpen?.(tool.id)}>
      <div className="tool-card-topline">
        <div className="tool-card-visual" aria-hidden="true">
          <span className="tool-icon">
            <Icon size={22} strokeWidth={1.9} />
          </span>
        </div>
        <button
          aria-label={isFavorite ? '取消收藏' : '收藏工具'}
          className={`tool-card-favorite ${isFavorite ? 'active' : ''}`}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onToggleFavorite?.(tool.id)
          }}
        >
          <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="tool-card-meta">
        <div className="tool-card-title">
          <h3>{tool.name}</h3>
        </div>
        <p>{tool.description}</p>
      </div>
      <div className="tag-list">
        <span className={`tag category-tag category-${tool.category}`}>{tool.category}</span>
        {tool.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <span className="tool-card-hover-actions">
        <span className="tool-card-primary-action">
          <ArrowRight size={18} />
          立即使用
        </span>
      </span>
    </Link>
  )
}
