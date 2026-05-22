import { useMemo, useState } from 'react'

function parseUa(ua: string) {
  const browser = ua.includes('Edg/') ? 'Edge' : ua.includes('Chrome/') ? 'Chrome' : ua.includes('Firefox/') ? 'Firefox' : ua.includes('Safari/') ? 'Safari' : '未知'
  const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS') ? 'macOS' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : ua.includes('Linux') ? 'Linux' : '未知'
  const mobile = /Mobile|Android|iPhone/.test(ua) ? '是' : '否'
  return `浏览器: ${browser}\n系统: ${os}\n移动设备: ${mobile}\n原始 UA:\n${ua}`
}

export function UserAgentParserTool() {
  const [ua, setUa] = useState(navigator.userAgent)
  const output = useMemo(() => parseUa(ua), [ua])

  return (
    <div className="tool-form">
      <textarea className="textarea" value={ua} onChange={(event) => setUa(event.target.value)} />
      <pre className="result-box">{output}</pre>
    </div>
  )
}
