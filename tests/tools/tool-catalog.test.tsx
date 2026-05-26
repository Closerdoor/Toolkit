import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { catalogTools } from '../../src/data/tools'
import { toolNavigationGroups } from '../../src/data/toolGroups'

describe('tool catalog integrity', () => {
  it('has unique ids and paths for every registered tool', () => {
    const ids = catalogTools.map((tool) => tool.id)
    const paths = catalogTools.map((tool) => tool.path)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(paths).size).toBe(paths.length)
    expect(catalogTools.length).toBeGreaterThan(80)
  })

  it('keeps metadata complete enough for search, cards, and detail pages', () => {
    for (const tool of catalogTools) {
      expect(tool.id, 'id').toMatch(/^[a-z0-9-]+$/)
      expect(tool.path, tool.id).toBe(`/tools/${tool.id}`)
      expect(tool.name, tool.id).toBeTruthy()
      expect(tool.description, tool.id).toBeTruthy()
      expect(tool.keywords.length, tool.id).toBeGreaterThan(0)
      expect(tool.tags.length, tool.id).toBeGreaterThan(0)
      expect(tool.component, tool.id).toBeTypeOf('function')
    }
  })

  it('does not reference missing tools from navigation groups', () => {
    const ids = new Set(catalogTools.map((tool) => tool.id))
    const missing = toolNavigationGroups.flatMap((group) => group.toolIds.filter((id) => !ids.has(id)).map((id) => `${group.id}:${id}`))

    expect(missing).toEqual([])
  })
})

describe('all tools render as usable controls', () => {
  it.each(catalogTools)('$id renders without crashing and exposes interactive UI', (tool) => {
    const ToolComponent = tool.component
    const { container } = render(
      <MemoryRouter>
        <ToolComponent />
      </MemoryRouter>,
    )

    expect(container.textContent?.trim().length, tool.id).toBeGreaterThan(0)

    const interactive = container.querySelectorAll('a, button, input, select, textarea, [role="button"]')
    expect(interactive.length, tool.id).toBeGreaterThan(0)
  })
})
