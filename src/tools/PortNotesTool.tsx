import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type PortNote = { port: string; name: string; note: string }

export function PortNotesTool() {
  const [notes, setNotes] = useLocalStorage<PortNote[]>('toolkit-port-notes', [
    { port: '5173', name: 'Vite', note: '当前 ToolKit 本地开发服务' },
    { port: '3000', name: 'Next.js', note: '常见前端开发端口' },
  ])
  const [draft, setDraft] = useState<PortNote>({ port: '', name: '', note: '' })

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" placeholder="端口" value={draft.port} onChange={(event) => setDraft({ ...draft, port: event.target.value })} />
        <input className="input" placeholder="服务" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <input className="input" placeholder="备注" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
      </div>
      <button className="button primary" type="button" onClick={() => draft.port && setNotes((current) => [draft, ...current])}>添加</button>
      <pre className="result-box">{notes.map((item) => `${item.port}  ${item.name}  ${item.note}`).join('\n')}</pre>
    </div>
  )
}
