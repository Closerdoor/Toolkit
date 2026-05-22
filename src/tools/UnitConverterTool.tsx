import { useMemo, useState } from 'react'

const groups = {
  长度: { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048 },
  重量: { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.0283495 },
  温度: { c: 0, f: 0, k: 0 },
}

export function UnitConverterTool() {
  const [group, setGroup] = useState<keyof typeof groups>('长度')
  const [value, setValue] = useState(1)
  const [from, setFrom] = useState('m')
  const result = useMemo(() => {
    if (group === '温度') {
      const c = from === 'c' ? value : from === 'f' ? (value - 32) / 1.8 : value - 273.15
      return `摄氏: ${c.toFixed(2)} °C\n华氏: ${(c * 1.8 + 32).toFixed(2)} °F\n开尔文: ${(c + 273.15).toFixed(2)} K`
    }
    const table = groups[group] as Record<string, number>
    const base = value * table[from]
    return Object.entries(table).map(([unit, rate]) => `${unit}: ${(base / rate).toFixed(6)}`).join('\n')
  }, [from, group, value])

  const units = Object.keys(groups[group])

  return (
    <div className="tool-form">
      <div className="three-col">
        <select className="select" value={group} onChange={(event) => { const next = event.target.value as keyof typeof groups; setGroup(next); setFrom(Object.keys(groups[next])[0]) }}>
          {Object.keys(groups).map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
        <select className="select" value={from} onChange={(event) => setFrom(event.target.value)}>
          {units.map((unit) => <option key={unit}>{unit}</option>)}
        </select>
      </div>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
