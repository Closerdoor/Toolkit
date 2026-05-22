import { developerTools } from './tools/developer'
import { imageTools } from './tools/image'
import { lifeTools } from './tools/life'
import { textTools } from './tools/text'
import type { ToolCategory } from './tools/types'

export type { ToolCategory, ToolItem } from './tools/types'

export const categories: ToolCategory[] = ['开发工具', '文本编码', '视觉图片', '生活实用']

export const tools = [...developerTools, ...textTools, ...imageTools, ...lifeTools]

export const catalogTools = tools

export function getToolById(id: string | undefined) {
  return tools.find((tool) => tool.id === id)
}
