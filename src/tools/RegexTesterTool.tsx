import { useMemo, useState } from 'react'

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\btool\\w*')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('ToolKit is a personal toolkit. Every tool should be quick.')

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags)
      const matches = Array.from(text.matchAll(regex))
      return { ok: true, matches }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : '正则无效', matches: [] }
    }
  }, [flags, pattern, text])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>正则表达式</label>
          <input className="input" value={pattern} onChange={(event) => setPattern(event.target.value)} />
        </div>
        <div className="field">
          <label>Flags</label>
          <input className="input" value={flags} onChange={(event) => setFlags(event.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>测试文本</label>
        <textarea className="textarea" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className={`status ${result.ok ? 'success' : 'error'}`}>{result.ok ? `匹配 ${result.matches.length} 项` : result.error}</div>
      <pre className="result-box">
        {result.ok
          ? result.matches.map((match, index) => `${index + 1}. "${match[0]}" at ${match.index}`).join('\n') || '没有匹配结果'
          : result.error}
      </pre>
    </div>
  )
}
