import { useState } from 'react'

export function RandomStringTool() {
  const [length, setLength] = useState(12)
  const [result, setResult] = useState('')
  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = crypto.getRandomValues(new Uint32Array(length))
    setResult(Array.from(bytes, (byte) => chars[byte % chars.length]).join(''))
  }
  return (
    <div className="tool-form">
      <input className="input" type="number" value={length} onChange={(event) => setLength(Number(event.target.value))} />
      <button className="button primary" type="button" onClick={generate}>生成</button>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
