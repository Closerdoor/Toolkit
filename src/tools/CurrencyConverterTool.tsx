import { useMemo, useState } from 'react'

export function CurrencyConverterTool() {
  const [amount, setAmount] = useState(100)
  const [rate, setRate] = useState(7.2)
  const output = useMemo(() => `结果: ${(amount * rate).toFixed(2)}\n反向: ${(amount / rate).toFixed(2)}`, [amount, rate])
  return (
    <div className="tool-form">
      <p className="status">静态站首版使用手动汇率，后续接后端后可改为实时汇率。</p>
      <div className="two-col">
        <input className="input" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        <input className="input" type="number" step="0.0001" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
      </div>
      <pre className="result-box">{output}</pre>
    </div>
  )
}
