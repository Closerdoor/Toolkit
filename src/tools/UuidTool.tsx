import { useMemo, useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function makeUuids(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID())
}

export function UuidTool() {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [uuids, setUuids] = useState(makeUuids(5))
  const output = useMemo(
    () =>
      uuids
        .map((uuid) => {
          const normalized = hyphens ? uuid : uuid.replaceAll('-', '')
          return uppercase ? normalized.toUpperCase() : normalized
        })
        .join('\n'),
    [hyphens, uppercase, uuids],
  )

  const generate = () => setUuids(makeUuids(Math.min(100, Math.max(1, count))))

  return (
    <div className="tool-form">
      <div className="three-col">
        <div className="field">
          <label>生成数量</label>
          <input className="input" type="number" min="1" max="100" value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </div>
        <label className="chip">
          <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} />
          大写
        </label>
        <label className="chip">
          <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)} />
          保留连字符
        </label>
      </div>
      <pre className="result-box">{output}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={generate}>
          <RefreshCw size={16} />
          重新生成
        </button>
        <button className="button" type="button" onClick={() => copyText(output)}>
          <Copy size={16} />
          复制全部
        </button>
      </div>
    </div>
  )
}
