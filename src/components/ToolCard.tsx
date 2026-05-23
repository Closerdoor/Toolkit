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
      <div className="tool-card-visual" aria-hidden="true">
        <span className="visual-glow visual-glow-one" />
        <span className="visual-glow visual-glow-two" />
        <span className="tool-icon">
          <Icon size={30} strokeWidth={1.9} />
        </span>
      </div>
      <div className="tool-card-copy">
        <h3>{tool.name}</h3>
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
        打开工具
        <ArrowRight size={15} />
      </span>
    </Link>
  )
}
