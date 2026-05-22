import { useMemo, useState } from 'react'

export function TextStatsTool() {
  const [input, setInput] = useState('ToolKit 是一个 personal tools workspace.')
  const stats = useMemo(() => {
    const chars = input.length
    const noSpaces = input.replace(/\s/g, '').length
    const lines = input ? input.split(/\r?\n/).length : 0
    const words = input.trim() ? input.trim().split(/\s+/).length : 0
    const chinese = (input.match(/[\u4e00-\u9fa5]/g) || []).length
    return `字符数: ${chars}\n非空白字符: ${noSpaces}\n行数: ${lines}\n词数: ${words}\n中文字符: ${chinese}`
  }, [input])

  return (
    <div className="tool-form">
      <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      <pre className="result-box">{stats}</pre>
    </div>
  )
}
