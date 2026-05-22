import { useMemo, useState } from 'react'

function typeOfValue(value: unknown, name: string): string {
  if (Array.isArray(value)) return `${typeOfValue(value[0], name)}[]`
  if (value === null) return 'null'
  if (typeof value !== 'object') return typeof value
  const lines = Object.entries(value as Record<string, unknown>).map(([key, child]) => `  ${key}: ${typeOfValue(child, key)}`)
  return `{\n${lines.join('\n')}\n}`
}

export function JsonToTsTool() {
  const [name, setName] = useState('ApiResponse')
  const [json, setJson] = useState('{"id":1,"name":"ToolKit","tags":["tool"]}')
  const output = useMemo(() => {
    try {
      return `export interface ${name} ${typeOfValue(JSON.parse(json), name)}`
    } catch (error) {
      return error instanceof Error ? error.message : '生成失败'
    }
  }, [json, name])

  return (
    <div className="tool-form">
      <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
      <div className="two-col">
        <textarea className="textarea" value={json} onChange={(event) => setJson(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
