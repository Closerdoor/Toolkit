import { useMemo, useState } from 'react'

export function TextCleanerTool() {
  const [input, setInput] = useState('apple\nbanana\napple\n\norange')
  const [sort, setSort] = useState(false)
  const [unique, setUnique] = useState(true)
  const [trim, setTrim] = useState(true)
  const output = useMemo(() => {
    let lines = input.split(/\r?\n/)
    if (trim) lines = lines.map((line) => line.trim()).filter(Boolean)
    if (unique) lines = [...new Set(lines)]
    if (sort) lines = [...lines].sort((a, b) => a.localeCompare(b))
    return lines.join('\n')
  }, [input, sort, trim, unique])

  return (
    <div className="tool-form">
      <div className="button-row">
        <label className="chip"><input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} /> 去空行/空格</label>
        <label className="chip"><input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} /> 去重</label>
        <label className="chip"><input type="checkbox" checked={sort} onChange={(event) => setSort(event.target.checked)} /> 排序</label>
      </div>
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
