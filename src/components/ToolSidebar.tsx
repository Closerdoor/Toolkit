import { NavLink } from 'react-router-dom'
import { categories, tools } from '../data/tools'

export function ToolSidebar() {
  return (
    <aside className="sidebar">
      {categories.map((category) => (
        <div key={category}>
          <div className="sidebar-title">{category}</div>
          {tools
            .filter((tool) => tool.category === category)
            .map((tool) => {
              const Icon = tool.icon
              return (
                <NavLink className="sidebar-link" key={tool.id} to={tool.path}>
                  <Icon size={16} />
                  {tool.name}
                </NavLink>
              )
            })}
        </div>
      ))}
    </aside>
  )
}
