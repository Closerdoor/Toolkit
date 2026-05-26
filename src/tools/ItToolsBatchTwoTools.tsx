import { useEffect, useMemo, useState } from 'react'
import { Copy, Pause, Play, RotateCcw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function copyButton(value: string) {
  return <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />复制结果</button>
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
}

function ipv4ToNumber(value: string) {
  const parts = value.trim().split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null
  return parts.reduce((sum, part) => (sum << 8) + part, 0) >>> 0
}

function numberToIpv4(value: number) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.')
}

function safeEvaluate(expression: string) {
  if (!/^[\d+\-*/().,%\s^]+$/.test(expression)) throw new Error('只支持数字和基础运算符')
  const js = expression.replace(/\^/g, '**').replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
  return Function(`"use strict"; return (${js})`)()
}

export function DockerRunComposeTool() {
  const [input, setInput] = useState('docker run -d --name web -p 8080:80 -e NODE_ENV=production nginx:latest')
  const output = useMemo(() => {
    const tokens = input.match(/"[^"]+"|'[^']+'|\S+/g)?.map((token) => token.replace(/^['"]|['"]$/g, '')) ?? []
    const image = tokens.at(-1) ?? 'image:latest'
    const nameIndex = tokens.findIndex((token) => token === '--name')
    const ports = tokens.flatMap((token, index) => (token === '-p' || token === '--publish' ? [tokens[index + 1]] : [])).filter(Boolean)
    const envs = tokens.flatMap((token, index) => (token === '-e' || token === '--env' ? [tokens[index + 1]] : [])).filter(Boolean)
    const serviceName = nameIndex >= 0 ? tokens[nameIndex + 1] : image.split(':')[0].replace(/[^\w-]/g, '-')
    return [
      'services:',
      `  ${serviceName}:`,
      `    image: ${image}`,
      '    restart: unless-stopped',
      ...(ports.length ? ['    ports:', ...ports.map((port) => `      - "${port}"`)] : []),
      ...(envs.length ? ['    environment:', ...envs.map((env) => `      - ${env}`)] : []),
    ].join('\n')
  }, [input])
  return <div className="tool-form"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState('ToolKit')
  const [description, setDescription] = useState('Local-first developer toolbox')
  const [url, setUrl] = useState('https://example.com')
  const output = `<title>${title}</title>
<meta name="description" content="${description}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />`
  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
        <input className="input" value={description} onChange={(event) => setDescription(event.target.value)} />
        <input className="input" value={url} onChange={(event) => setUrl(event.target.value)} />
      </div>
      <pre className="result-box">{output}</pre>
      {copyButton(output)}
    </div>
  )
}

export function Ipv4AddressConverterTool() {
  const [ip, setIp] = useState('192.168.1.1')
  const n = ipv4ToNumber(ip)
  const output = n === null ? '请输入有效 IPv4 地址' : [`Decimal: ${n}`, `Hex: 0x${n.toString(16).toUpperCase().padStart(8, '0')}`, `Binary: ${n.toString(2).padStart(32, '0')}`].join('\n')
  return <div className="tool-form"><input className="input" value={ip} onChange={(event) => setIp(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function Ipv4SubnetCalculatorTool() {
  const [ip, setIp] = useState('192.168.1.42')
  const [cidr, setCidr] = useState(24)
  const output = useMemo(() => {
    const n = ipv4ToNumber(ip)
    if (n === null) return '请输入有效 IPv4 地址'
    const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
    const network = n & mask
    const broadcast = network | (~mask >>> 0)
    return [`Netmask: ${numberToIpv4(mask)}`, `Network: ${numberToIpv4(network)}`, `Broadcast: ${numberToIpv4(broadcast)}`, `First host: ${numberToIpv4(network + 1)}`, `Last host: ${numberToIpv4(broadcast - 1)}`, `Hosts: ${Math.max(0, broadcast - network - 1)}`].join('\n')
  }, [cidr, ip])
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" value={ip} onChange={(event) => setIp(event.target.value)} />
        <input className="input" type="number" min="0" max="32" value={cidr} onChange={(event) => setCidr(Number(event.target.value))} />
      </div>
      <pre className="result-box">{output}</pre>
      {copyButton(output)}
    </div>
  )
}

export function Ipv6UlaGeneratorTool() {
  const generate = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(5))
    const globalId = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
    return `fd${globalId.slice(0, 2)}:${globalId.slice(2, 6)}:${globalId.slice(6)}::/48`
  }
  const [value, setValue] = useState(generate)
  return <div className="tool-form"><pre className="result-box">{value}</pre><button className="button primary" type="button" onClick={() => setValue(generate())}>生成 IPv6 ULA</button>{copyButton(value)}</div>
}

export function MathEvaluatorTool() {
  const [expression, setExpression] = useState('(12 + 8) * 3 / 2')
  const output = useMemo(() => {
    try {
      return String(safeEvaluate(expression))
    } catch (error) {
      return error instanceof Error ? error.message : '表达式无效'
    }
  }, [expression])
  return <div className="tool-form"><input className="input" value={expression} onChange={(event) => setExpression(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function EtaCalculatorTool() {
  const [done, setDone] = useState(35)
  const [total, setTotal] = useState(100)
  const [rate, setRate] = useState(5)
  const [now] = useState(() => Date.now())
  const remaining = Math.max(0, total - done)
  const minutes = rate > 0 ? remaining / rate : 0
  const output = `剩余 ${remaining} 项\n预计 ${minutes.toFixed(1)} 分钟\n完成时间 ${new Date(now + minutes * 60000).toLocaleString()}`
  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="number" value={done} onChange={(event) => setDone(Number(event.target.value))} />
        <input className="input" type="number" value={total} onChange={(event) => setTotal(Number(event.target.value))} />
        <input className="input" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
      </div>
      <pre className="result-box">{output}</pre>
    </div>
  )
}

export function ChronometerTool() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!running) return
    const started = Date.now() - elapsed
    const timer = window.setInterval(() => setElapsed(Date.now() - started), 100)
    return () => window.clearInterval(timer)
  }, [elapsed, running])
  const output = `${Math.floor(elapsed / 60000).toString().padStart(2, '0')}:${Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((elapsed % 1000) / 100)}`
  return (
    <div className="tool-form">
      <pre className="result-box">{output}</pre>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? '暂停' : '开始'}</button>
        <button className="button" type="button" onClick={() => { setRunning(false); setElapsed(0) }}><RotateCcw size={16} />重置</button>
      </div>
    </div>
  )
}

export function TemperatureConverterTool() {
  const [celsius, setCelsius] = useState(25)
  const output = [`Celsius: ${celsius.toFixed(2)} °C`, `Fahrenheit: ${(celsius * 9 / 5 + 32).toFixed(2)} °F`, `Kelvin: ${(celsius + 273.15).toFixed(2)} K`].join('\n')
  return <div className="tool-form"><input className="input" type="number" value={celsius} onChange={(event) => setCelsius(Number(event.target.value))} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function SvgPlaceholderTool() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(420)
  const [text, setText] = useState('ToolKit')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#0f766e"/>
  <text x="50%" y="50%" fill="#fff" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">${escapeHtml(text)}</text>
</svg>`
  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        <input className="input" type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
        <input className="input" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="svg-workflow-preview" dangerouslySetInnerHTML={{ __html: svg }} />
      <pre className="result-box">{svg}</pre>
      {copyButton(svg)}
    </div>
  )
}
