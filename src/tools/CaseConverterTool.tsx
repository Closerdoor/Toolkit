import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function words(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function CaseConverterTool() {
  const [input, setInput] = useState('toolkit utility name')
  const output = useMemo(() => {
    const list = words(input)
    return {
      camel: list.map((word, index) => (index === 0 ? word : cap(word))).join(''),
      pascal: list.map(cap).join(''),
      snake: list.join('_'),
      kebab: list.join('-'),
      constant: list.join('_').toUpperCase(),
    }
  }, [input])
  const text = Object.entries(output)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  return (
    <div className="tool-form">
      <div className="field">
        <label>输入名称</label>
        <input className="input" value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <pre className="result-box">{text}</pre>
      <button className="button" type="button" onClick={() => copyText(text)}>
        <Copy size={16} />
        复制全部
      </button>
    </div>
  )
}
