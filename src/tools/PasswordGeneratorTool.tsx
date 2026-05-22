import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function generate(length: number, symbols: boolean) {
  const chars = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${symbols ? '!@#$%^&*_-+=' : ''}`
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('')
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(18)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState(() => generate(18, true))

  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" type="number" min="6" max="128" value={length} onChange={(event) => setLength(Number(event.target.value))} />
        <label className="chip"><input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} /> 包含符号</label>
      </div>
      <pre className="result-box">{password}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setPassword(generate(length, symbols))}><RefreshCw size={16} />重新生成</button>
        <button className="button" type="button" onClick={() => copyText(password)}><Copy size={16} />复制</button>
      </div>
    </div>
  )
}
