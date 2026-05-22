import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

export function UrlCodecTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('https://example.com/search?q=工具箱')
  const result = useMemo(() => {
    try {
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    } catch {
      return '输入不是有效的 URL 编码内容'
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
