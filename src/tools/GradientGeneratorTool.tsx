import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

export function GradientGeneratorTool() {
  const [from, setFrom] = useState('#0f766e')
  const [to, setTo] = useState('#2563eb')
  const [angle, setAngle] = useState(135)
  const css = useMemo(() => `linear-gradient(${angle}deg, ${from}, ${to})`, [angle, from, to])

  return (
    <div className="tool-form">
      <div className="three-col">
        <input type="color" value={from} onChange={(event) => setFrom(event.target.value)} />
        <input type="color" value={to} onChange={(event) => setTo(event.target.value)} />
        <input className="input" type="number" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
      </div>
      <div className="color-preview" style={{ background: css }} />
      <pre className="result-box">background: {css};</pre>
      <button className="button" type="button" onClick={() => copyText(`background: ${css};`)}>
        <Copy size={16} />
        复制 CSS
      </button>
    </div>
  )
}
