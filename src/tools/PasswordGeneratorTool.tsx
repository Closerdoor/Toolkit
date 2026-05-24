import { useMemo, useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

type Rules = {
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
}

const pools = {
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  lower: 'abcdefghijkmnopqrstuvwxyz',
  numbers: '23456789',
  symbols: '!@#$%^&*_-+=',
}

function generate(length: number, rules: Rules) {
  const enabled = Object.entries(rules).filter(([, enabled]) => enabled) as Array<[keyof Rules, boolean]>
  const chars = enabled.map(([key]) => pools[key]).join('') || pools.lower
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('')
}

function getStrength(password: string, rules: Rules) {
  const variety = Object.values(rules).filter(Boolean).length
  const score = Math.min(100, password.length * 4 + variety * 12)
  if (score >= 80) return { score, label: '强', tone: 'success' }
  if (score >= 55) return { score, label: '中', tone: 'warning' }
  return { score, label: '弱', tone: 'error' }
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(18)
  const [rules, setRules] = useState<Rules>({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState(() => generate(18, rules))
  const strength = useMemo(() => getStrength(password, rules), [password, rules])
  const updateRule = (key: keyof Rules, enabled: boolean) => setRules((current) => ({ ...current, [key]: enabled }))

  return (
    <div className="tool-form">
      <div className="field">
        <label>长度：{length}</label>
        <input className="input" type="range" min="6" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} />
      </div>
      <div className="button-row">
        <label className="chip"><input type="checkbox" checked={rules.upper} onChange={(event) => updateRule('upper', event.target.checked)} /> 大写</label>
        <label className="chip"><input type="checkbox" checked={rules.lower} onChange={(event) => updateRule('lower', event.target.checked)} /> 小写</label>
        <label className="chip"><input type="checkbox" checked={rules.numbers} onChange={(event) => updateRule('numbers', event.target.checked)} /> 数字</label>
        <label className="chip"><input type="checkbox" checked={rules.symbols} onChange={(event) => updateRule('symbols', event.target.checked)} /> 符号</label>
      </div>
      <pre className="result-box">{password}</pre>
      <div className="strength-meter">
        <span style={{ width: `${strength.score}%` }} />
      </div>
      <p className={`status ${strength.tone}`}>密码强度：{strength.label}</p>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setPassword(generate(length, rules))}>
          <RefreshCw size={16} />
          重新生成
        </button>
        <button className="button" type="button" onClick={() => copyText(password)}>
          <Copy size={16} />
          复制
        </button>
      </div>
    </div>
  )
}
