import { references } from '../data/references'

export function InspirationAnalysisTool() {
  const tagCounts = references.flatMap((item) => [...item.tags, ...item.usage]).reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  const summary = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => `${tag}: ${count}`).join('\n')

  return (
    <div className="tool-form">
      <pre className="result-box">{summary || '先录入更多参考网页，再回来做归纳。'}</pre>
      <p className="muted">这是一个初步分析面板，用来从参考网页标签里观察你关注的功能、交互和视觉方向。</p>
    </div>
  )
}
