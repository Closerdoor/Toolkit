import { useMemo, useState } from 'react'

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState(1000000)
  const [years, setYears] = useState(30)
  const [rate, setRate] = useState(3.5)
  const result = useMemo(() => {
    const months = years * 12
    const monthlyRate = rate / 100 / 12
    const payment = (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1)
    const total = payment * months
    const firstPrincipalPayment = principal / months + principal * monthlyRate
    return `等额本息月供: ${payment.toFixed(2)}\n等额本息总利息: ${(total - principal).toFixed(2)}\n等额本金首月: ${firstPrincipalPayment.toFixed(2)}\n期数: ${months}`
  }, [principal, rate, years])

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
        <input className="input" type="number" value={years} onChange={(event) => setYears(Number(event.target.value))} />
        <input className="input" type="number" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
      </div>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
