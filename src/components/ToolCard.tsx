import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ToolItem } from '../data/tools'

type Props = {
  tool: ToolItem
  onOpen?: (id: string) => void
}

export function ToolCard({ tool, onOpen }: Props) {
  const Icon = tool.icon
  const tone = Math.abs([...tool.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 6

  return (
    <Link className={`tool-card tone-${tone}`} to={tool.path} onClick={() => onOpen?.(tool.id)}>
      <div className="tool-card-topline">
        <div className="tool-card-visual" aria-hidden="true">
          <span className="visual-glow visual-glow-one" />
          <span className="visual-glow visual-glow-two" />
          <span className="tool-icon">
            <Icon size={26} strokeWidth={1.9} />
          </span>
        </div>
        <div className="tool-card-title">
          <h3>{tool.name}</h3>
        </div>
      </div>
      <div className="tool-card-copy">
        <p>{tool.description}</p>
      </div>
      <div className="tag-list">
        <span className="tag category-tag">{tool.category}</span>
        {tool.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <span className="tool-card-action">
        立即使用
        <ArrowRight size={15} />
      </span>
    </Link>
  )
}
