import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'
import { bytesToHex } from '../utils/format'

const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const

export function HashTool() {
  const [input, setInput] = useState('ToolKit')
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]>('SHA-256')
  const [hash, setHash] = useState('')

  useEffect(() => {
    const run = async () => {
      const data = new TextEncoder().encode(input)
      const digest = await crypto.subtle.digest(algorithm, data)
      setHash(bytesToHex(digest))
    }
    run()
  }, [algorithm, input])

  return (
    <div className="tool-form">
      <div className="field">
        <label>输入文本</label>
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="field">
        <label>算法</label>
        <select className="select" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as (typeof algorithms)[number])}>
          {algorithms.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <pre className="result-box">{hash}</pre>
      <button className="button" type="button" onClick={() => copyText(hash)}>
        <Copy size={16} />
        复制 Hash
      </button>
    </div>
  )
}
