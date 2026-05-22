import { useMemo, useState } from 'react'

export function WorkdayCalculatorTool() {
  const [start, setStart] = useState('2026-05-01')
  const [end, setEnd] = useState('2026-05-31')
  const output = useMemo(() => {
    const from = new Date(start)
    const to = new Date(end)
    let days = 0
    let workdays = 0
    for (const date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) {
      days += 1
      if (date.getDay() !== 0 && date.getDay() !== 6) workdays += 1
    }
    return `自然日: ${days}\n工作日: ${workdays}\n周末: ${days - workdays}`
  }, [end, start])
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        <input className="input" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
      </div>
      <pre className="result-box">{output}</pre>
    </div>
  )
}
