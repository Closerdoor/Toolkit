import { useMemo, useState } from 'react'

const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'VALUES', 'SET']

function formatSql(input: string) {
  let sql = input.replace(/\s+/g, ' ').trim()
  keywords.forEach((keyword) => {
    sql = sql.replace(new RegExp(`\\s+${keyword}\\s+`, 'gi'), `\n${keyword} `)
  })
  return sql.replace(/,\s*/g, ',\n  ').replace(/\s+(AND|OR)\s+/gi, '\n  $1 ')
}

export function SqlFormatterTool() {
  const [input, setInput] = useState('select id,name,email from users where status = 1 and created_at > now() order by id desc limit 20')
  const output = useMemo(() => formatSql(input), [input])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>SQL 输入</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>格式化结果</label>
          <pre className="result-box">{output}</pre>
        </div>
      </div>
    </div>
  )
}
