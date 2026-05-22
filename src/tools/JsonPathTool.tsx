import { useMemo, useState } from 'react'

function queryPath(data: unknown, path: string) {
  const parts = path
    .replace(/^\$\./, '')
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
  return parts.reduce<unknown>((current, key) => {
    if (current === null || current === undefined) return undefined
    return (current as Record<string, unknown>)[key]
  }, data)
}

export function JsonPathTool() {
  const [json, setJson] = useState('{"data":{"items":[{"name":"ToolKit","type":"app"}]}}')
  const [path, setPath] = useState('$.data.items[0].name')
  const output = useMemo(() => {
    try {
      return JSON.stringify(queryPath(JSON.parse(json), path), null, 2)
    } catch (error) {
      return error instanceof Error ? error.message : '查询失败'
    }
  }, [json, path])

  return (
    <div className="tool-form">
      <input className="input" value={path} onChange={(event) => setPath(event.target.value)} />
      <div className="two-col">
        <textarea className="textarea" value={json} onChange={(event) => setJson(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
