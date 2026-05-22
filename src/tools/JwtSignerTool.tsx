import { useMemo, useState } from 'react'

function encode(input: string) {
  return btoa(unescape(encodeURIComponent(input))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function JwtSignerTool() {
  const [header, setHeader] = useState('{"alg":"none","typ":"JWT"}')
  const [payload, setPayload] = useState('{"sub":"toolkit","name":"ToolKit"}')
  const token = useMemo(() => {
    try {
      JSON.parse(header)
      JSON.parse(payload)
      return `${encode(header)}.${encode(payload)}.`
    } catch (error) {
      return error instanceof Error ? error.message : '生成失败'
    }
  }, [header, payload])
  return (
    <div className="tool-form">
      <p className="status">首版生成 alg=none 结构，适合调试 payload，不用于生产签名。</p>
      <div className="two-col">
        <textarea className="textarea" value={header} onChange={(event) => setHeader(event.target.value)} />
        <textarea className="textarea" value={payload} onChange={(event) => setPayload(event.target.value)} />
      </div>
      <pre className="result-box">{token}</pre>
    </div>
  )
}
