import { useEffect, useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
}

function simpleMarkdownToHtml(input: string) {
  const lines = escapeHtml(input).split(/\r?\n/)
  const html: string[] = []
  let inList = false
  for (const line of lines) {
    if (/^- /.test(line)) {
      if (!inList) html.push('<ul>')
      inList = true
      html.push(`<li>${line.replace(/^- /, '')}</li>`)
      continue
    }
    if (inList) {
      html.push('</ul>')
      inList = false
    }
    if (line.startsWith('### ')) html.push(`<h3>${line.slice(4)}</h3>`)
    else if (line.startsWith('## ')) html.push(`<h2>${line.slice(3)}</h2>`)
    else if (line.startsWith('# ')) html.push(`<h1>${line.slice(2)}</h1>`)
    else if (line.trim()) html.push(`<p>${line}</p>`)
  }
  if (inList) html.push('</ul>')
  return html.join('\n').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
}

function jsonToXml(value: unknown, nodeName = 'root'): string {
  if (Array.isArray(value)) return value.map((item) => jsonToXml(item, nodeName.slice(0, -1) || 'item')).join('')
  if (value && typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>).map(([key, item]) => jsonToXml(item, key)).join('')
    return `<${nodeName}>${children}</${nodeName}>`
  }
  return `<${nodeName}>${escapeHtml(String(value ?? ''))}</${nodeName}>`
}

function formatXml(xml: string) {
  let depth = 0
  return xml
    .replace(/></g, '>\n<')
    .split('\n')
    .map((line) => {
      if (/^<\//.test(line)) depth -= 1
      const indent = '  '.repeat(Math.max(0, depth))
      if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !line.includes(`</`)) depth += 1
      return `${indent}${line}`
    })
    .join('\n')
}

function flattenJson(value: unknown, path = '$'): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => flattenJson(item, `${path}[${index}]`))
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => flattenJson(item, `${path}.${key}`))
  return [`${path}: ${JSON.stringify(value)}`]
}

function diffJson(left: unknown, right: unknown, path = '$'): string[] {
  if (JSON.stringify(left) === JSON.stringify(right)) return []
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') {
    return [`${path}: ${JSON.stringify(left)} -> ${JSON.stringify(right)}`]
  }
  const keys = new Set([...Object.keys(left as Record<string, unknown>), ...Object.keys(right as Record<string, unknown>)])
  return [...keys].flatMap((key) => diffJson((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key], `${path}.${key}`))
}

function romanize(value: number) {
  const table: Array<[number, string]> = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let n = Math.max(1, Math.min(3999, Math.floor(value || 1)))
  let out = ''
  for (const [num, symbol] of table) {
    while (n >= num) {
      out += symbol
      n -= num
    }
  }
  return out
}

function fromRoman(input: string) {
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  return input.toUpperCase().split('').reduce((sum, char, index, chars) => {
    const current = values[char] ?? 0
    const next = values[chars[index + 1]] ?? 0
    return sum + (current < next ? -current : current)
  }, 0)
}

function PanelCopy({ value, label = '复制结果' }: { value: string; label?: string }) {
  return <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />{label}</button>
}

export function IntegerBaseConverterTool() {
  const [input, setInput] = useState('255')
  const [base, setBase] = useState(10)
  const value = Number.parseInt(input.trim(), base)
  const output = Number.isNaN(value) ? '请输入有效数字' : [`BIN  ${value.toString(2)}`, `OCT  ${value.toString(8)}`, `DEC  ${value.toString(10)}`, `HEX  ${value.toString(16).toUpperCase()}`].join('\n')
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" value={input} onChange={(event) => setInput(event.target.value)} />
        <select className="select" value={base} onChange={(event) => setBase(Number(event.target.value))}>
          <option value="2">Base 2</option>
          <option value="8">Base 8</option>
          <option value="10">Base 10</option>
          <option value="16">Base 16</option>
        </select>
      </div>
      <pre className="result-box">{output}</pre>
      <PanelCopy value={output} />
    </div>
  )
}

export function RomanNumeralConverterTool() {
  const [input, setInput] = useState('1994')
  const numeric = /^\d+$/.test(input.trim())
  const output = numeric ? romanize(Number(input)) : String(fromRoman(input))
  return (
    <div className="tool-form">
      <input className="input" value={input} onChange={(event) => setInput(event.target.value)} />
      <pre className="result-box">{output}</pre>
      <PanelCopy value={output} />
    </div>
  )
}

export function NatoAlphabetTool() {
  const [input, setInput] = useState('ToolKit')
  const map: Record<string, string> = { A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu' }
  const output = input.toUpperCase().split('').map((char) => map[char] ?? char).join(' ')
  return (
    <div className="tool-form">
      <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
      <pre className="result-box">{output}</pre>
      <PanelCopy value={output} />
    </div>
  )
}

export function JsonViewerTool() {
  const [input, setInput] = useState('{"name":"ToolKit","items":[{"id":1,"type":"static"}]}')
  const output = useMemo(() => {
    try {
      return flattenJson(JSON.parse(input)).join('\n')
    } catch (error) {
      return error instanceof Error ? error.message : 'JSON 解析失败'
    }
  }, [input])
  return (
    <div className="tool-form">
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
      <PanelCopy value={output} />
    </div>
  )
}

export function JsonDiffTool() {
  const [left, setLeft] = useState('{"name":"ToolKit","count":1}')
  const [right, setRight] = useState('{"name":"ToolKit","count":2,"local":true}')
  const output = useMemo(() => {
    try {
      const lines = diffJson(JSON.parse(left), JSON.parse(right))
      return lines.length ? lines.join('\n') : '两个 JSON 内容一致'
    } catch (error) {
      return error instanceof Error ? error.message : 'JSON 解析失败'
    }
  }, [left, right])
  return (
    <div className="tool-form">
      <div className="two-col">
        <textarea className="textarea" value={left} onChange={(event) => setLeft(event.target.value)} />
        <textarea className="textarea" value={right} onChange={(event) => setRight(event.target.value)} />
      </div>
      <pre className="result-box">{output}</pre>
      <PanelCopy value={output} />
    </div>
  )
}

export function JsonToXmlTool() {
  const [input, setInput] = useState('{"tool":{"name":"ToolKit","local":true}}')
  const output = useMemo(() => {
    try {
      return formatXml(jsonToXml(JSON.parse(input)))
    } catch (error) {
      return error instanceof Error ? error.message : 'JSON 解析失败'
    }
  }, [input])
  return (
    <div className="tool-form">
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
      <PanelCopy value={output} />
    </div>
  )
}

export function MarkdownToHtmlTool() {
  const [input, setInput] = useState('# ToolKit\n\n- static\n- local\n\n支持 **bold** 和 `code`。')
  const output = useMemo(() => simpleMarkdownToHtml(input), [input])
  return (
    <div className="tool-form">
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
      <PanelCopy value={output} label="复制 HTML" />
    </div>
  )
}

export function RegexCheatsheetTool() {
  const output = [
    '.        任意字符',
    '\\d      数字，等价于 [0-9]',
    '\\w      字母、数字、下划线',
    '\\s      空白字符',
    '^ / $    开始 / 结束',
    '* + ?    0 次以上 / 1 次以上 / 0 或 1 次',
    '{m,n}    重复 m 到 n 次',
    '(...)    捕获分组',
    '(?:...)  非捕获分组',
    '[abc]    字符集合',
    '(?=x)    正向预查',
  ].join('\n')
  return <div className="tool-form"><pre className="result-box">{output}</pre><PanelCopy value={output} /></div>
}

export function KeycodeInfoTool() {
  const [info, setInfo] = useState('按下任意键查看 KeyboardEvent 信息')
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      event.preventDefault()
      setInfo(JSON.stringify({ key: event.key, code: event.code, keyCode: event.keyCode, altKey: event.altKey, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, metaKey: event.metaKey }, null, 2))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  return <div className="tool-form"><pre className="result-box">{info}</pre><PanelCopy value={info} /></div>
}

export function DeviceInformationTool() {
  const info = typeof navigator === 'undefined' ? {} : {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    screen: typeof screen === 'undefined' ? undefined : `${screen.width}x${screen.height}`,
    viewport: typeof window === 'undefined' ? undefined : `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
  const output = JSON.stringify(info, null, 2)
  return <div className="tool-form"><pre className="result-box">{output}</pre><PanelCopy value={output} /></div>
}
