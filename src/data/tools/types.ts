import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type ToolCategory = '开发工具' | '文本编码' | '生活实用' | '视觉图片' | '设计工具' | '游戏娱乐'

export type ToolItem = {
  id: string
  name: string
  path: string
  category: ToolCategory
  description: string
  keywords: string[]
  tags: string[]
  icon: LucideIcon
  component: ComponentType
  localOnly: boolean
  references: string[]
}
