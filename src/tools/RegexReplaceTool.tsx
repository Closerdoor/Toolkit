import { useMemo, useState } from 'react'

export function RegexReplaceTool() {
  const [pattern, setPattern] = useState('\\s+')
  const [flags, setFlags] = useState('g')
  const [replacement, setReplacement] = useState(' ')
  const [input, setInput] = useState('ToolKit    makes\nsmall tools easier.')
  const output = useMemo(() => {
    try {
      return input.replace(new RegExp(pattern, flags), replacement)
    } catch (error) {
      return error instanceof Error ? error.message : '替换失败'
    }
  }, [flags, input, pattern, replacement])

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" value={pattern} onChange={(event) => setPattern(event.target.value)} />
        <input className="input" value={flags} onChange={(event) => setFlags(event.target.value)} />
        <input className="input" value={replacement} onChange={(event) => setReplacement(event.target.value)} />
      </div>
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
