import { useMemo, useState } from 'react'
import { ArrowLeftRight, Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

const encode = (value: string) => btoa(unescape(encodeURIComponent(value)))
const decode = (value: string) => decodeURIComponent(escape(atob(value)))
const toUrlSafe = (value: string) => value.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
const fromUrlSafe = (value: string) => value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4)

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('ToolKit')
  const result = useMemo(() => {
    try {
      return mode === 'encode' ? encode(input) : decode(fromUrlSafe(input))
    } catch {
      return '输入不是有效的 Base64 内容'
    }
  }, [input, mode])
  const urlSafeResult = mode === 'encode' ? toUrlSafe(result) : result

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className={`chip ${mode === 'encode' ? 'active' : ''}`} type="button" onClick={() => setMode('encode')}>
          编码
        </button>
        <button className={`chip ${mode === 'decode' ? 'active' : ''}`} type="button" onClick={() => setMode('decode')}>
          解码
        </button>
        <button className="button" type="button" onClick={() => setInput(result)}>
          <ArrowLeftRight size={16} />
          输出转输入
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
      {mode === 'encode' && <pre className="result-box">URL Safe: {urlSafeResult}</pre>}
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(result)}>
          <Copy size={16} />
          复制输出
        </button>
        {mode === 'encode' && (
          <button className="button" type="button" onClick={() => copyText(urlSafeResult)}>
            <Copy size={16} />
            复制 URL Safe
          </button>
        )}
      </div>
    </div>
  )
}
