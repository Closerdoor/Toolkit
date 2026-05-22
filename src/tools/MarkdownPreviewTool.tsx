import { useMemo, useState } from 'react'

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
}

function renderMarkdown(input: string) {
  return escapeHtml(input)
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />')
}

export function MarkdownPreviewTool() {
  const [input, setInput] = useState('# ToolKit\n\n- 快速\n- 本地\n\n支持 **粗体**、`代码` 和 [链接](https://example.com)。')
  const html = useMemo(() => renderMarkdown(input), [input])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>Markdown</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>预览</label>
          <div className="result-box markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
