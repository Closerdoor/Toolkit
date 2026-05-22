import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type LinkItem = { title: string; url: string; tag: string }

export function PersonalLinksTool() {
  const [items, setItems] = useLocalStorage<LinkItem[]>('toolkit-personal-links', [])
  const [draft, setDraft] = useState<LinkItem>({ title: '', url: '', tag: '' })

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" placeholder="名称" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        <input className="input" placeholder="链接" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
        <input className="input" placeholder="标签" value={draft.tag} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} />
      </div>
      <button className="button primary" type="button" onClick={() => draft.title && draft.url && setItems((current) => [draft, ...current])}>添加链接</button>
      <div className="reference-grid">
        {items.map((item, index) => <a className="reference-card" key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer"><h3>{item.title}</h3><p className="muted">{item.tag || item.url}</p></a>)}
      </div>
    </div>
  )
}
