import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

type BuzzwordMode = 'policy' | 'internet'

const policyOpeners = ['要坚持问题导向', '要强化系统观念', '要围绕高质量发展', '要立足长远布局']
const policyActions = ['找准关键抓手', '夯实底层能力', '打通堵点难点', '形成闭环机制']
const internetOpeners = ['从增长视角看', '站在用户心智侧', '回到业务飞轮里', '面向下一阶段跃迁']
const internetActions = ['打造核心抓手', '撬动增量蓝海', '沉淀方法论', '形成正向飞轮']

function splitSentences(text: string) {
  return text.split(/[\n。！？!?]+/).map((item) => item.trim()).filter(Boolean)
}

function transformBuzzwords(text: string, mode: BuzzwordMode) {
  const source = splitSentences(text || '我们需要把这个功能做好，让更多用户愿意使用。')
  const openers = mode === 'policy' ? policyOpeners : internetOpeners
  const actions = mode === 'policy' ? policyActions : internetActions
  const suffix = mode === 'policy'
    ? '持续提升治理效能和服务质效。'
    : '最终实现体验、效率与商业价值的协同跃迁。'

  return source.map((sentence, index) => {
    const opener = openers[index % openers.length]
    const action = actions[index % actions.length]
    if (mode === 'policy') {
      return `${opener}，以“${sentence}”为主线，${action}，统筹推进资源整合、流程再造和能力提升，${suffix}`
    }
    return `${opener}，“${sentence}”不是单点需求，而是打开新增量场景的关键入口。我们需要${action}，拉齐认知、对齐节奏、做厚壁垒，${suffix}`
  }).join('\n\n')
}

export function BuzzwordGeneratorTool() {
  const [input, setInput] = useState('我们需要把搜索和分类体验做好，让用户更快找到自己需要的工具。')
  const [mode, setMode] = useState<BuzzwordMode>('policy')
  const output = useMemo(() => transformBuzzwords(input, mode), [input, mode])

  return (
    <div className="tool-form">
      <div className="button-row">
        <label><input type="radio" name="buzzword-mode" checked={mode === 'policy'} onChange={() => setMode('policy')} /> 申论风格</label>
        <label><input type="radio" name="buzzword-mode" checked={mode === 'internet'} onChange={() => setMode('internet')} /> 互联网黑话</label>
      </div>
      <div className="two-col">
        <div className="field">
          <label>原始文本</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>润色结果</label>
          <textarea className="textarea" value={output} readOnly />
        </div>
      </div>
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(output)}>
          <Copy size={16} />
          复制结果
        </button>
      </div>
    </div>
  )
}
