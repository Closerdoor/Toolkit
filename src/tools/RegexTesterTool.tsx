import { useMemo, useState } from 'react'

const templates = [
  { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'gi' },
  { name: 'URL', pattern: 'https?:\\/\\/[^\\s]+', flags: 'gi' },
  { name: '手机号', pattern: '1[3-9]\\d{9}', flags: 'g' },
  { name: '中文', pattern: '[\\u4e00-\\u9fa5]+', flags: 'g' },
]

function renderHighlighted(text: string, matches: RegExpMatchArray[]) {
  const parts: Array<{ text: string; active: boolean }> = []
  let cursor = 0
  for (const match of matches) {
    const index = match.index ?? 0
    if (index > cursor) parts.push({ text: text.slice(cursor, index), active: false })
    parts.push({ text: match[0], active: true })
    cursor = index + match[0].length
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), active: false })
  return parts
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\btool\\w*')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('ToolKit is a personal toolkit. Every tool should be quick.')

  const result = useMemo(() => {
    try {
      const safeFlags = flags.includes('g') ? flags : `${flags}g`
      const regex = new RegExp(pattern, safeFlags)
      const matches = Array.from(text.matchAll(regex))
      return { ok: true, matches, highlighted: renderHighlighted(text, matches) }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : '正则无效', matches: [], highlighted: [] }
    }
  }, [flags, pattern, text])

  return (
    <div className="tool-form">
      <div className="button-row">
        {templates.map((template) => (
          <button
            className="chip"
            key={template.name}
            type="button"
            onClick={() => {
              setPattern(template.pattern)
              setFlags(template.flags)
            }}
          >
            {template.name}
          </button>
        ))}
      </div>
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
      {result.ok && (
        <div className="regex-highlight">
          {result.highlighted.map((part, index) => (
            <span className={part.active ? 'active' : ''} key={`${part.text}-${index}`}>
              {part.text}
            </span>
          ))}
        </div>
      )}
      <pre className="result-box">
        {result.ok
          ? result.matches
              .map((match, index) => `${index + 1}. "${match[0]}" at ${match.index}${match.length > 1 ? ` | groups: ${match.slice(1).join(', ')}` : ''}`)
              .join('\n') || '没有匹配结果'
          : result.error}
      </pre>
    </div>
  )
}
