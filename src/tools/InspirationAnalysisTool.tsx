import { Copy } from 'lucide-react'
import { references } from '../data/references'
import { copyText } from '../utils/clipboard'

export function InspirationAnalysisTool() {
  const tagCounts = references.flatMap((item) => [...item.tags, ...item.usage]).reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  const summary = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => `${tag}: ${count}`).join('\n')

  return (
    <div className="tool-form">
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(summary)} disabled={!summary}>
          <Copy size={16} />
          Copy summary
        </button>
      </div>
      <pre className="result-box">{summary || 'Add more reference pages before generating an inspiration summary.'}</pre>
      <p className="muted">
        Summarizes repeated tags and usage scenarios from saved reference pages so the design direction is easier to compare.
      </p>
    </div>
  )
}
