import { useState } from 'react'
import { normalizeLines } from '../utils/format'

export function GroupSplitterTool() {
  const [input, setInput] = useState('张三\n李四\n王五\n赵六\n钱七\n孙八')
  const [count, setCount] = useState(2)
  const [result, setResult] = useState('')
  const split = () => {
    const shuffled = normalizeLines(input).sort(() => Math.random() - 0.5)
    const groups = Array.from({ length: count }, () => [] as string[])
    shuffled.forEach((item, index) => groups[index % count].push(item))
    setResult(groups.map((group, index) => `第 ${index + 1} 组\n${group.join('\n')}`).join('\n\n'))
  }
  return (
    <div className="tool-form">
      <input className="input" type="number" min="1" value={count} onChange={(event) => setCount(Number(event.target.value))} />
      <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      <button className="button primary" type="button" onClick={split}>随机分组</button>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
