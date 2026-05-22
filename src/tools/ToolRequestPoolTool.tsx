import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type RequestItem = { name: string; status: '想做' | '在做' | '已完成'; note: string }

export function ToolRequestPoolTool() {
  const [items, setItems] = useLocalStorage<RequestItem[]>('toolkit-tool-requests', [])
  const [draft, setDraft] = useState<RequestItem>({ name: '', status: '想做', note: '' })

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" placeholder="工具名" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <select className="select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as RequestItem['status'] })}>
          <option>想做</option><option>在做</option><option>已完成</option>
        </select>
        <input className="input" placeholder="备注" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
      </div>
      <button className="button primary" type="button" onClick={() => draft.name && setItems((current) => [draft, ...current])}>加入请求池</button>
      <pre className="result-box">{items.map((item) => `[${item.status}] ${item.name} - ${item.note}`).join('\n') || '暂无工具请求'}</pre>
    </div>
  )
}
