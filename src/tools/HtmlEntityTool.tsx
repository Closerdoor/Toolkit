import { useMemo, useState } from 'react'

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
}

function unescapeHtml(input: string) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = input
  return textarea.value
}

export function HtmlEntityTool() {
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')
  const [input, setInput] = useState('<div class="tool">ToolKit & You</div>')
  const output = useMemo(() => (mode === 'escape' ? escapeHtml(input) : unescapeHtml(input)), [input, mode])

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className={`chip ${mode === 'escape' ? 'active' : ''}`} type="button" onClick={() => setMode('escape')}>
          转义
        </button>
        <button className={`chip ${mode === 'unescape' ? 'active' : ''}`} type="button" onClick={() => setMode('unescape')}>
          反转义
        </button>
      </div>
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
