import { useMemo, useState } from 'react'
import YAML from 'yaml'

export function YamlJsonTool() {
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
  const [input, setInput] = useState('name: ToolKit\nfeatures:\n  - tools\n  - references')
  const output = useMemo(() => {
    try {
      return mode === 'yaml-to-json' ? JSON.stringify(YAML.parse(input), null, 2) : YAML.stringify(JSON.parse(input))
    } catch (error) {
      return error instanceof Error ? error.message : '转换失败'
    }
  }, [input, mode])

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className={`chip ${mode === 'yaml-to-json' ? 'active' : ''}`} type="button" onClick={() => setMode('yaml-to-json')}>
          YAML 转 JSON
        </button>
        <button className={`chip ${mode === 'json-to-yaml' ? 'active' : ''}`} type="button" onClick={() => setMode('json-to-yaml')}>
          JSON 转 YAML
        </button>
      </div>
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
    </div>
  )
}
