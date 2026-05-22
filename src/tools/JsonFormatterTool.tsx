import { useMemo, useState } from 'react'
import { Copy, FileJson, Minimize2, WandSparkles } from 'lucide-react'
import { copyText } from '../utils/clipboard'

export function JsonFormatterTool() {
  const [input, setInput] = useState('{\n  "name": "ToolKit",\n  "purpose": "personal tools"\n}')
  const [space, setSpace] = useState('2')
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input)
      return { ok: true, text: JSON.stringify(parsed, null, Number(space)) }
    } catch (error) {
      return { ok: false, text: error instanceof Error ? error.message : 'JSON 解析失败' }
    }
  }, [input, space])

  const compact = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input)))
    } catch {
      return
    }
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label htmlFor="json-input">输入 JSON</label>
          <textarea id="json-input" className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>格式化结果</label>
          <pre className="result-box">{result.text}</pre>
        </div>
      </div>
      <div className="button-row">
        <select className="select" style={{ width: 120 }} value={space} onChange={(event) => setSpace(event.target.value)}>
          <option value="2">2 空格</option>
          <option value="4">4 空格</option>
        </select>
        <button className="button primary" type="button" onClick={() => result.ok && setInput(result.text)}>
          <WandSparkles size={16} />
          格式化
        </button>
        <button className="button" type="button" onClick={compact}>
          <Minimize2 size={16} />
          压缩
        </button>
        <button className="button" type="button" onClick={() => copyText(result.ok ? result.text : '')}>
          <Copy size={16} />
          复制结果
        </button>
        <span className={`status ${result.ok ? 'success' : 'error'}`}>
          <FileJson size={14} /> {result.ok ? 'JSON 有效' : 'JSON 无效'}
        </span>
      </div>
    </div>
  )
}
