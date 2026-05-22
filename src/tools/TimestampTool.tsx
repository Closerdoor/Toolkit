import { useMemo, useState } from 'react'

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString())
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 19))

  const dateFromTimestamp = useMemo(() => {
    const numeric = Number(timestamp)
    if (!Number.isFinite(numeric)) return '时间戳无效'
    const milliseconds = timestamp.length <= 10 ? numeric * 1000 : numeric
    return new Date(milliseconds).toLocaleString()
  }, [timestamp])

  const timestampFromDate = useMemo(() => {
    const value = new Date(dateInput).getTime()
    if (!Number.isFinite(value)) return '日期无效'
    return `${Math.floor(value / 1000)} 秒\n${value} 毫秒`
  }, [dateInput])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>时间戳转日期</label>
          <input className="input" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} />
          <pre className="result-box">{dateFromTimestamp}</pre>
        </div>
        <div className="field">
          <label>日期转时间戳</label>
          <input className="input" type="datetime-local" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
          <pre className="result-box">{timestampFromDate}</pre>
        </div>
      </div>
      <button className="button" type="button" onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}>
        使用当前时间
      </button>
    </div>
  )
}
