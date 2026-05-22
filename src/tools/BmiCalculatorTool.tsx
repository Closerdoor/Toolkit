import { useMemo, useState } from 'react'

export function BmiCalculatorTool() {
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(65)
  const result = useMemo(() => {
    const bmi = weight / (height / 100) ** 2
    const label = bmi < 18.5 ? '偏瘦' : bmi < 24 ? '正常' : bmi < 28 ? '超重' : '肥胖'
    return `BMI: ${bmi.toFixed(1)}\n区间: ${label}`
  }, [height, weight])

  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
        <input className="input" type="number" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
      </div>
      <pre className="result-box">{result}</pre>
    </div>
  )
}
