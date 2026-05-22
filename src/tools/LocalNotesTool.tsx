import { useLocalStorage } from '../hooks/useLocalStorage'

export function LocalNotesTool() {
  const [note, setNote] = useLocalStorage('toolkit-local-note', '这里可以记录临时文本，只保存在当前浏览器。')
  return (
    <div className="tool-form">
      <textarea className="textarea" style={{ minHeight: 360 }} value={note} onChange={(event) => setNote(event.target.value)} />
      <p className="status">内容自动保存在 localStorage。</p>
    </div>
  )
}
