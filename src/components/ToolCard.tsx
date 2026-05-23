import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ToolItem } from '../data/tools'

type Props = {
  tool: ToolItem
  onOpen?: (id: string) => void
}

export function ToolCard({ tool, onOpen }: Props) {
  const Icon = tool.icon

  return (
    <Link className="tool-card" to={tool.path} onClick={() => onOpen?.(tool.id)}>
      <div className="tool-card-head">
        <span className="tool-icon">
          <Icon size={24} />
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
