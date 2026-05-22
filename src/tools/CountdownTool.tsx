import { useEffect, useMemo, useState } from 'react'

export function CountdownTool() {
  const [target, setTarget] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16))
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const result = useMemo(() => {
    const diff = new Date(target).getTime() - now
    if (!Number.isFinite(diff)) return '目标时间无效'
    if (diff <= 0) return '时间已到'
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`
  }, [now, target])

  return (
    <div className="tool-form">
      <input className="input" type="datetime-local" value={target} onChange={(event) => setTarget(event.target.value)} />
      <pre className="result-box" style={{ fontSize: 24 }}>{result}</pre>
    </div>
  )
}
