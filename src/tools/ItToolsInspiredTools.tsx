import { useMemo, useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function randomFrom(chars: string, length: number) {
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('')
}

function bytesToHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hmac(message: string, secret: string, hash: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return bytesToHex(new Uint8Array(signature))
}

function ulid() {
  const time = Date.now().toString(36).toUpperCase().padStart(10, '0').slice(-10)
  return `${time}${randomFrom('0123456789ABCDEFGHJKMNPQRSTVWXYZ', 16)}`
}

export function TokenGeneratorTool() {
  const [length, setLength] = useState(32)
  const [token, setToken] = useState(() => randomFrom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 32))
  return (
    <div className="tool-form">
      <div className="field">
        <label>长度：{length}</label>
        <input className="input" type="range" min="8" max="128" value={length} onChange={(event) => setLength(Number(event.target.value))} />
      </div>
      <pre className="result-box">{token}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setToken(randomFrom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', length))}>
          <RefreshCw size={16} />
          生成 Token
        </button>
        <button className="button" type="button" onClick={() => copyText(token)}><Copy size={16} />复制</button>
      </div>
    </div>
  )
}

export function UlidTool() {
  const [count, setCount] = useState(5)
  const [value, setValue] = useState(() => Array.from({ length: 5 }, ulid).join('\n'))
  return (
    <div className="tool-form">
      <input className="input" type="number" min="1" max="100" value={count} onChange={(event) => setCount(Number(event.target.value))} />
      <pre className="result-box">{value}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setValue(Array.from({ length: Math.max(1, Math.min(100, count)) }, ulid).join('\n'))}>生成 ULID</button>
        <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />复制</button>
      </div>
    </div>
  )
}

export function HmacGeneratorTool() {
  const [message, setMessage] = useState('ToolKit')
  const [secret, setSecret] = useState('secret')
  const [hash, setHash] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256')
  const [result, setResult] = useState('')
  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" value={secret} onChange={(event) => setSecret(event.target.value)} />
        <select className="select" value={hash} onChange={(event) => setHash(event.target.value as typeof hash)}>
          <option>SHA-1</option>
          <option>SHA-256</option>
          <option>SHA-384</option>
          <option>SHA-512</option>
        </select>
        <button className="button primary" type="button" onClick={async () => setResult(await hmac(message, secret, hash))}>生成 HMAC</button>
      </div>
      <textarea className="textarea" value={message} onChange={(event) => setMessage(event.target.value)} />
      <pre className="result-box">{result || '结果会显示在这里'}</pre>
      <button className="button" type="button" onClick={() => copyText(result)}><Copy size={16} />复制</button>
    </div>
  )
}

export function BasicAuthTool() {
  const [username, setUsername] = useState('toolkit')
  const [password, setPassword] = useState('secret')
  const value = `Basic ${btoa(`${username}:${password}`)}`
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" value={username} onChange={(event) => setUsername(event.target.value)} />
        <input className="input" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <pre className="result-box">{value}</pre>
      <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />复制 Header</button>
    </div>
  )
}

const mimeMap: Record<string, string> = {
  json: 'application/json',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  ts: 'text/typescript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
}

export function MimeLookupTool() {
  const [input, setInput] = useState('json')
  const key = input.replace(/^\./, '').toLowerCase()
  return <LookupTool title="MIME Type" value={mimeMap[key] ?? '未收录，可按扩展名查询，例如 json、png、svg'} onInput={setInput} input={input} />
}

const statusMap: Record<string, string> = {
  '200': 'OK：请求成功',
  '201': 'Created：资源已创建',
  '204': 'No Content：成功但无响应体',
  '301': 'Moved Permanently：永久重定向',
  '302': 'Found：临时重定向',
  '400': 'Bad Request：请求无效',
  '401': 'Unauthorized：未认证',
  '403': 'Forbidden：无权限',
  '404': 'Not Found：资源不存在',
  '429': 'Too Many Requests：请求过多',
  '500': 'Internal Server Error：服务器错误',
  '502': 'Bad Gateway：网关错误',
  '503': 'Service Unavailable：服务不可用',
}

export function HttpStatusTool() {
  const [input, setInput] = useState('404')
  return <LookupTool title="HTTP 状态码" value={statusMap[input.trim()] ?? '未收录，请输入常见 HTTP 状态码'} onInput={setInput} input={input} />
}

function LookupTool({ title, input, value, onInput }: { title: string; input: string; value: string; onInput: (value: string) => void }) {
  return (
    <div className="tool-form">
      <input className="input" value={input} onChange={(event) => onInput(event.target.value)} />
      <pre className="result-box">{title}: {value}</pre>
      <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />复制</button>
    </div>
  )
}

export function SlugifyTool() {
  const [input, setInput] = useState('Hello ToolKit 工具箱')
  const slug = input.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/_+/g, '-').toLowerCase()
  return <TextTransformTool input={input} output={slug} setInput={setInput} label="Slug" />
}

export function JsonMinifyTool() {
  const [input, setInput] = useState('{\n  "name": "ToolKit",\n  "ok": true\n}')
  const output = useMemo(() => {
    try { return JSON.stringify(JSON.parse(input)) } catch (error) { return error instanceof Error ? error.message : 'JSON 无效' }
  }, [input])
  return <TextTransformTool input={input} output={output} setInput={setInput} label="压缩 JSON" />
}

export function JsonToCsvSimpleTool() {
  const [input, setInput] = useState('[{"name":"ToolKit","type":"tool"},{"name":"IT Tools","type":"reference"}]')
  const output = useMemo(() => {
    try {
      const rows = JSON.parse(input)
      if (!Array.isArray(rows) || rows.length === 0) return '请输入对象数组'
      const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
      return [keys.join(','), ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? '')).join(','))].join('\n')
    } catch (error) {
      return error instanceof Error ? error.message : 'JSON 无效'
    }
  }, [input])
  return <TextTransformTool input={input} output={output} setInput={setInput} label="CSV" />
}

export function ListConverterTool() {
  const [input, setInput] = useState('apple\nbanana\norange')
  const [separator, setSeparator] = useState(',')
  const output = input.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).join(separator)
  return (
    <div className="tool-form">
      <input className="input" value={separator} onChange={(event) => setSeparator(event.target.value)} />
      <TextTransformTool input={input} output={output} setInput={setInput} label="转换结果" />
    </div>
  )
}

export function TextBinaryTool() {
  const [input, setInput] = useState('ToolKit')
  const output = [...input].map((char) => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
  return <TextTransformTool input={input} output={output} setInput={setInput} label="二进制" />
}

export function TextUnicodeTool() {
  const [input, setInput] = useState('ToolKit 工具箱')
  const output = [...input].map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`).join('')
  return <TextTransformTool input={input} output={output} setInput={setInput} label="Unicode" />
}

export function RandomPortTool() {
  const [port, setPort] = useState(() => String(1024 + Math.floor(Math.random() * 55000)))
  return (
    <div className="tool-form">
      <pre className="result-box">{port}</pre>
      <button className="button primary" type="button" onClick={() => setPort(String(1024 + Math.floor(Math.random() * 55000)))}>生成随机端口</button>
    </div>
  )
}

export function ChmodCalculatorTool() {
  const [owner, setOwner] = useState(7)
  const [group, setGroup] = useState(5)
  const [other, setOther] = useState(5)
  return (
    <div className="tool-form">
      <div className="three-col">
        {[['Owner', owner, setOwner], ['Group', group, setGroup], ['Other', other, setOther]].map(([label, value, setValue]) => (
          <div className="field" key={label as string}>
            <label>{label as string}: {value as number}</label>
            <input className="input" type="range" min="0" max="7" value={value as number} onChange={(event) => (setValue as (n: number) => void)(Number(event.target.value))} />
          </div>
        ))}
      </div>
      <pre className="result-box">chmod {owner}{group}{other}</pre>
    </div>
  )
}

export function PercentageCalculatorTool() {
  const [value, setValue] = useState(25)
  const [total, setTotal] = useState(200)
  const percent = total === 0 ? 0 : (value / total) * 100
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
        <input className="input" type="number" value={total} onChange={(event) => setTotal(Number(event.target.value))} />
      </div>
      <pre className="result-box">{value} / {total} = {percent.toFixed(2)}%</pre>
    </div>
  )
}

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = useState(2)
  const sentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  const output = Array.from({ length: paragraphs }, () => sentence).join('\n\n')
  return (
    <div className="tool-form">
      <input className="input" type="number" min="1" max="10" value={paragraphs} onChange={(event) => setParagraphs(Number(event.target.value))} />
      <pre className="result-box">{output}</pre>
      <button className="button" type="button" onClick={() => copyText(output)}><Copy size={16} />复制</button>
    </div>
  )
}

export function StringObfuscatorTool() {
  const [input, setInput] = useState('ToolKit')
  const output = [...input].map((char) => `&#${char.charCodeAt(0)};`).join('')
  return <TextTransformTool input={input} output={output} setInput={setInput} label="混淆结果" />
}

export function AsciiArtTool() {
  const [input, setInput] = useState('TK')
  const output = input.toUpperCase().split('').map((char) => `[ ${char} ]`).join('  ')
  return <TextTransformTool input={input} output={output} setInput={setInput} label="ASCII Art" />
}

export function NumeronymTool() {
  const [input, setInput] = useState('internationalization')
  const output = input.length <= 3 ? input : `${input[0]}${input.length - 2}${input.at(-1)}`
  return <TextTransformTool input={input} output={output} setInput={setInput} label="Numeronym" />
}

function TextTransformTool({ input, output, setInput, label }: { input: string; output: string; setInput: (value: string) => void; label: string }) {
  return (
    <div className="tool-form">
      <div className="two-col">
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <pre className="result-box">{output}</pre>
      </div>
      <button className="button" type="button" onClick={() => copyText(output)}><Copy size={16} />复制 {label}</button>
    </div>
  )
}
