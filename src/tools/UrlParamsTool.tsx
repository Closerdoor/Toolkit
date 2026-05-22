import { useMemo, useState } from 'react'

export function UrlParamsTool() {
  const [input, setInput] = useState('https://example.com/search?q=toolkit&page=1')
  const output = useMemo(() => {
    try {
      const url = new URL(input.includes('://') ? input : `https://example.com/?${input}`)
      return Array.from(url.searchParams.entries()).map(([key, value]) => `${key}: ${value}`).join('\n') || '没有参数'
    } catch {
      return 'URL 无效'
    }
  }, [input])

  return (
    <div className="tool-form">
      <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      <pre className="result-box">{output}</pre>
    </div>
  )
}
