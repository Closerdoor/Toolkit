import { Link } from 'react-router-dom'
import type { ToolItem } from '../data/tools'

type Props = {
  tool: ToolItem
  onOpen?: (id: string) => void
}

export function ToolCard({ tool, onOpen }: Props) {
  const Icon = tool.icon

  return (
    <Link className="tool-card" to={tool.path} onClick={() => onOpen?.(tool.id)}>
      <div className="tool-card-top">
        <span className="tool-icon">
          <Icon size={20} />
        </span>
        <div>
          <h3>{tool.name}</h3>
          <p>{tool.category}</p>
        </div>
      </div>
      <p>{tool.description}</p>
      <div className="tag-list">
        {tool.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
