import { useMemo, useState } from 'react'

type DiffRow = { type: 'same' | 'add' | 'remove'; text: string }

function diffLines(left: string[], right: string[]) {
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0) as number[])
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] = left[i] === right[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const rows: DiffRow[] = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      rows.push({ type: 'same', text: left[i] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: 'remove', text: left[i] })
      i += 1
    } else {
      rows.push({ type: 'add', text: right[j] })
      j += 1
    }
  }
  while (i < left.length) rows.push({ type: 'remove', text: left[i++] })
  while (j < right.length) rows.push({ type: 'add', text: right[j++] })
  return rows
}

export function TextDiffTool() {
  const [left, setLeft] = useState('name=ToolKit\nmode=light\nstatus=ready')
  const [right, setRight] = useState('name=ToolKit\nmode=dark\nstatus=ready\nsync=false')
  const rows = useMemo(() => diffLines(left.split(/\r?\n/), right.split(/\r?\n/)), [left, right])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>原文本</label>
          <textarea className="textarea" value={left} onChange={(event) => setLeft(event.target.value)} />
        </div>
        <div className="field">
          <label>新文本</label>
          <textarea className="textarea" value={right} onChange={(event) => setRight(event.target.value)} />
        </div>
      </div>
      <pre className="result-box">
        {rows.map((row) => `${row.type === 'add' ? '+ ' : row.type === 'remove' ? '- ' : '  '}${row.text}`).join('\n')}
      </pre>
    </div>
  )
}
