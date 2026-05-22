import { useMemo, useState } from 'react'

function decodePart(part: string) {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
  return JSON.parse(decodeURIComponent(escape(atob(padded))))
}

export function JwtDecoderTool() {
  const [token, setToken] = useState('')
  const result = useMemo(() => {
    try {
      const [header, payload, signature] = token.split('.')
      if (!header || !payload) throw new Error('JWT 至少需要 Header 和 Payload 两段')
      const decodedPayload = decodePart(payload)
      const expiresAt = decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toLocaleString() : '未包含 exp'
      return {
        ok: true,
        text: `Header\n${JSON.stringify(decodePart(header), null, 2)}\n\nPayload\n${JSON.stringify(decodedPayload, null, 2)}\n\n过期时间\n${expiresAt}\n\nSignature\n${signature || '无'}`,
      }
    } catch (error) {
      return { ok: false, text: error instanceof Error ? error.message : 'JWT 解析失败' }
    }
  }, [token])

  return (
    <div className="tool-form">
      <div className="field">
        <label>JWT Token</label>
        <textarea className="textarea" value={token} onChange={(event) => setToken(event.target.value.trim())} placeholder="粘贴 JWT..." />
      </div>
      <div className={`status ${result.ok ? 'success' : 'error'}`}>{result.ok ? '解析成功，不包含签名验证' : '解析失败'}</div>
      <pre className="result-box">{result.text}</pre>
    </div>
  )
}
