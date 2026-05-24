import { useMemo, useState } from 'react'
import { Copy, FileJson, Minimize2, RotateCcw, WandSparkles } from 'lucide-react'
import { copyText } from '../utils/clipboard'

const sampleJson = '{\n  "name": "ToolKit",\n  "purpose": "personal tools",\n  "items": [\n    "format",\n    "copy",\n    "validate"\n  ]\n}'

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObject)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortObject(item)]))
  }
  return value
}

function getErrorHint(message: string) {
  const match = message.match(/position (\d+)/)
  return match ? `错误位置：第 ${Number(match[1]) + 1} 个字符` : message
}

export function JsonFormatterTool() {
  const [input, setInput] = useState(sampleJson)
  const [space, setSpace] = useState('2')
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input)
      return { ok: true, text: JSON.stringify(parsed, null, Number(space)), parsed, hint: `${Array.isArray(parsed) ? parsed.length : Object.keys(parsed ?? {}).length} 个顶层项` }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'JSON 解析失败'
      return { ok: false, text: message, parsed: null, hint: getErrorHint(message) }
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
        <button className="button" type="button" onClick={() => result.ok && setInput(JSON.stringify(sortObject(result.parsed), null, Number(space)))}>
          排序 Key
        </button>
        <button className="button" type="button" onClick={() => setInput(sampleJson)}>
          <RotateCcw size={16} />
          示例
        </button>
        <button className="button" type="button" onClick={() => copyText(result.ok ? result.text : '')}>
          <Copy size={16} />
          复制结果
        </button>
        <span className={`status ${result.ok ? 'success' : 'error'}`}>
          <FileJson size={14} /> {result.ok ? `JSON 有效，${result.hint}` : result.hint}
        </span>
      </div>
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
    </div>
  )
}
