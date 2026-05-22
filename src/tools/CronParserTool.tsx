import { useMemo, useState } from 'react'

function parseField(field: string, min: number, max: number) {
  const values = new Set<number>()
  for (const part of field.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i += 1) values.add(i)
    } else if (part.includes('/')) {
      const [range, stepText] = part.split('/')
      const step = Number(stepText)
      const [start, end] = range === '*' ? [min, max] : range.split('-').map(Number)
      for (let i = start; i <= end; i += step) values.add(i)
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i += 1) values.add(i)
    } else {
      values.add(Number(part))
    }
  }
  return [...values].filter((value) => Number.isInteger(value) && value >= min && value <= max)
}

function nextRuns(expression: string) {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error('目前支持 5 段 Cron：分 时 日 月 周')
  const [minutes, hours, days, months, weekdays] = [
    parseField(parts[0], 0, 59),
    parseField(parts[1], 0, 23),
    parseField(parts[2], 1, 31),
    parseField(parts[3], 1, 12),
    parseField(parts[4], 0, 6),
  ]
  const result: Date[] = []
  const date = new Date()
  date.setSeconds(0, 0)
  for (let i = 0; i < 525600 && result.length < 8; i += 1) {
    date.setMinutes(date.getMinutes() + 1)
    if (
      minutes.includes(date.getMinutes()) &&
      hours.includes(date.getHours()) &&
      days.includes(date.getDate()) &&
      months.includes(date.getMonth() + 1) &&
      weekdays.includes(date.getDay())
    ) {
      result.push(new Date(date))
    }
  }
  return result
}

export function CronParserTool() {
  const [expression, setExpression] = useState('*/15 9-18 * * 1-5')
  const result = useMemo(() => {
    try {
      return nextRuns(expression).map((date) => date.toLocaleString()).join('\n')
    } catch (error) {
      return error instanceof Error ? error.message : 'Cron 解析失败'
    }
  }, [expression])

  return (
    <div className="tool-form">
      <div className="field">
        <label>Cron 表达式</label>
        <input className="input" value={expression} onChange={(event) => setExpression(event.target.value)} />
      </div>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
