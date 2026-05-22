import { useMemo, useState } from 'react'

export function AnniversaryTool() {
  const [date, setDate] = useState('2024-01-01')
  const [today] = useState(() => Date.now())
  const output = useMemo(() => {
    const start = new Date(date).getTime()
    const diff = today - start
    if (!Number.isFinite(diff)) return '日期无效'
    return `已经过去 ${Math.floor(diff / 86400000)} 天\n第 ${Math.floor(diff / 86400000) + 1} 天`
  }, [date, today])
  return (
    <div className="tool-form">
      <input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      <pre className="result-box">{output}</pre>
    </div>
  )
}
