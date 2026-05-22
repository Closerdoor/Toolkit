import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { normalizeLines } from '../utils/format'

export function RandomPickerTool() {
  const [input, setInput] = useState('今天吃面\n今天吃饭\n点外卖\n自己做')
  const [result, setResult] = useState('')
  const options = useMemo(() => normalizeLines(input), [input])

  const pick = () => {
    if (options.length === 0) return
    setResult(options[Math.floor(Math.random() * options.length)])
  }

  return (
    <div className="tool-form">
      <div className="field">
        <label>候选项，每行一个</label>
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <button className="button primary" type="button" onClick={pick}>
        <Shuffle size={16} />
        随机选择
      </button>
      <pre className="result-box">{result || `当前有 ${options.length} 个候选项`}</pre>
    </div>
  )
}
