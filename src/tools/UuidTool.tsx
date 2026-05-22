import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function makeUuids(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID()).join('\n')
}

export function UuidTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState(makeUuids(5))

  const generate = () => setUuids(makeUuids(count))

  return (
    <div className="tool-form">
      <div className="field">
        <label>生成数量</label>
        <input className="input" type="number" min="1" max="100" value={count} onChange={(event) => setCount(Number(event.target.value))} />
      </div>
      <pre className="result-box">{uuids}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={generate}>
          <RefreshCw size={16} />
          重新生成
        </button>
        <button className="button" type="button" onClick={() => copyText(uuids)}>
          <Copy size={16} />
          复制
        </button>
      </div>
    </div>
  )
}
