import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Snippet = { title: string; content: string }

export function SnippetLibraryTool() {
  const [items, setItems] = useLocalStorage<Snippet[]>('toolkit-snippets', [{ title: '启动项目', content: 'npm run dev' }])
  const [draft, setDraft] = useState<Snippet>({ title: '', content: '' })

  return (
    <div className="tool-form">
      <input className="input" placeholder="标题" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <textarea className="textarea" placeholder="片段内容" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} />
      <button className="button primary" type="button" onClick={() => draft.title && setItems((current) => [draft, ...current])}>保存片段</button>
      <pre className="result-box">{items.map((item) => `# ${item.title}\n${item.content}`).join('\n\n')}</pre>
    </div>
  )
}
