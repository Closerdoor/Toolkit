import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

const encode = (value: string) => btoa(unescape(encodeURIComponent(value)))
const decode = (value: string) => decodeURIComponent(escape(atob(value)))

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('ToolKit')
  const result = useMemo(() => {
    try {
      return mode === 'encode' ? encode(input) : decode(input)
    } catch {
      return '输入不是有效的 Base64 内容'
    }
  }, [input, mode])

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className={`chip ${mode === 'encode' ? 'active' : ''}`} type="button" onClick={() => setMode('encode')}>
          编码
        </button>
        <button className={`chip ${mode === 'decode' ? 'active' : ''}`} type="button" onClick={() => setMode('decode')}>
          解码
        </button>
      </div>
      <div className="two-col">
        <div className="field">
          <label>输入</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>输出</label>
          <pre className="result-box">{result}</pre>
        </div>
      </div>
      <button className="button" type="button" onClick={() => copyText(result)}>
        <Copy size={16} />
        复制输出
      </button>
    </div>
  )
}
