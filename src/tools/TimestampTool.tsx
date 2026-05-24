import { useMemo, useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function parseTimestamp(value: string) {
  const numeric = Number(value.trim())
  if (!Number.isFinite(numeric)) return null
  return value.trim().length <= 10 ? numeric * 1000 : numeric
}

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString())
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 19))

  const dateInfo = useMemo(() => {
    const milliseconds = parseTimestamp(timestamp)
    if (milliseconds === null) return null
    const date = new Date(milliseconds)
    if (Number.isNaN(date.getTime())) return null
    return {
      local: date.toLocaleString(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      seconds: Math.floor(milliseconds / 1000),
      milliseconds,
    }
  }, [timestamp])

  const timestampFromDate = useMemo(() => {
    const value = new Date(dateInput).getTime()
    if (!Number.isFinite(value)) return null
    return { seconds: Math.floor(value / 1000), milliseconds: value, iso: new Date(value).toISOString() }
  }, [dateInput])

  const useNow = () => {
    const now = new Date()
    setTimestamp(Math.floor(now.getTime() / 1000).toString())
    setDateInput(now.toISOString().slice(0, 19))
  }

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className="button primary" type="button" onClick={useNow}>
          <RefreshCw size={16} />
          使用当前时间
        </button>
        <button className="button" type="button" onClick={() => dateInfo && copyText(dateInfo.iso)}>
          <Copy size={16} />
          复制 ISO
        </button>
      </div>
      <div className="two-col">
        <div className="field">
          <label>时间戳转日期（自动识别秒/毫秒）</label>
          <input className="input" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} />
          <pre className="result-box">
            {dateInfo
              ? `本地时间：${dateInfo.local}\nUTC：${dateInfo.utc}\nISO：${dateInfo.iso}\n秒：${dateInfo.seconds}\n毫秒：${dateInfo.milliseconds}`
              : '时间戳无效'}
          </pre>
        </div>
        <div className="field">
          <label>日期转时间戳</label>
          <input className="input" type="datetime-local" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
          <pre className="result-box">
            {timestampFromDate
              ? `秒：${timestampFromDate.seconds}\n毫秒：${timestampFromDate.milliseconds}\nISO：${timestampFromDate.iso}`
              : '日期无效'}
          </pre>
        </div>
      </div>
    </div>
  )
}
