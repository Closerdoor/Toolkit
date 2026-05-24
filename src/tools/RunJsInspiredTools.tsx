import { useMemo, useState } from 'react'
import { Copy, Download, Scissors, WandSparkles } from 'lucide-react'
import jsQR from 'jsqr'
import TurndownService from 'turndown'
import { copyText } from '../utils/clipboard'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

type FormatParser = 'babel' | 'typescript' | 'html' | 'css' | 'markdown' | 'json'

const parserOptions: Array<{ label: string; value: FormatParser }> = [
  { label: 'JavaScript', value: 'babel' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'JSON', value: 'json' },
]

function hyphenToCamel(value: string) {
  return value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())
}

function svgToReact(svg: string, componentName: string) {
  const body = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s(class|for)=/g, ' $1Name=')
    .replace(/\s([a-zA-Z-]+)=/g, (_match, attr: string) => ` ${hyphenToCamel(attr)}=`)
    .replace(/style="([^"]*)"/g, (_, style: string) => {
      const entries = style
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          const [key, value] = item.split(':').map((part) => part.trim())
          return `${hyphenToCamel(key)}: '${value}'`
        })
      return `style={{ ${entries.join(', ')} }}`
    })

  return `import type { SVGProps } from 'react'\n\nexport function ${componentName}(props: SVGProps<SVGSVGElement>) {\n  return (\n    ${body.replace('<svg', '<svg {...props}')}\n  )\n}\n`
}

function pascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')
}

function rustFieldName(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

function inferRustType(value: unknown, name: string, structs: string[]): string {
  if (value === null) return 'Option<String>'
  if (typeof value === 'string') return 'String'
  if (typeof value === 'boolean') return 'bool'
  if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64'
  if (Array.isArray(value)) {
    const first = value.find((item) => item !== null)
    return `Vec<${first === undefined ? 'String' : inferRustType(first, name, structs)}>`
  }
  if (typeof value === 'object') {
    const structName = pascalCase(name)
    structs.push(buildRustStruct(value as Record<string, unknown>, structName, structs))
    return structName
  }
  return 'String'
}

function buildRustStruct(value: Record<string, unknown>, name: string, structs: string[]) {
  const fields = Object.entries(value)
    .map(([key, item]) => `    pub ${rustFieldName(key)}: ${inferRustType(item, key, structs)},`)
    .join('\n')
  return `#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]\npub struct ${name} {\n${fields}\n}`
}

export function CodeFormatterTool() {
  const [parser, setParser] = useState<FormatParser>('babel')
  const [input, setInput] = useState("const user={name:'ToolKit',items:[1,2,3]};console.log(user)")
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('选择语言后点击格式化。')

  const format = async () => {
    try {
      const [prettier, babelPlugin, estreePlugin, typescriptPlugin, htmlPlugin, postcssPlugin, markdownPlugin] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
        import('prettier/plugins/typescript'),
        import('prettier/plugins/html'),
        import('prettier/plugins/postcss'),
        import('prettier/plugins/markdown'),
      ])
      const next = await prettier.format(input, {
        parser,
        plugins: [babelPlugin, estreePlugin, typescriptPlugin, htmlPlugin, postcssPlugin, markdownPlugin],
        semi: false,
        singleQuote: true,
        printWidth: 90,
      })
      setOutput(next)
      setStatus('格式化完成')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '格式化失败')
    }
  }

  return (
    <div className="tool-form">
      <div className="button-row">
        <select className="select" style={{ width: 180 }} value={parser} onChange={(event) => setParser(event.target.value as FormatParser)}>
          {parserOptions.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button className="button primary" type="button" onClick={format}>
          <WandSparkles size={16} />
          格式化
        </button>
        <button className="button" type="button" onClick={() => output && copyText(output)}>
          <Copy size={16} />
          复制结果
        </button>
      </div>
      <div className="two-col">
        <div className="field">
          <label>输入代码</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>格式化结果</label>
          <pre className="result-box">{output || '结果会显示在这里'}</pre>
        </div>
      </div>
      <p className={`status ${output ? 'success' : ''}`}>{status}</p>
    </div>
  )
}

export function HtmlToMarkdownTool() {
  const [html, setHtml] = useState('<h1>ToolKit</h1><p>Static tools for everyday work.</p><ul><li>Fast</li><li>Local</li></ul>')
  const markdown = useMemo(() => new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' }).turndown(html), [html])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>HTML</label>
          <textarea className="textarea" value={html} onChange={(event) => setHtml(event.target.value)} />
        </div>
        <div className="field">
          <label>Markdown</label>
          <pre className="result-box">{markdown}</pre>
        </div>
      </div>
      <button className="button" type="button" onClick={() => copyText(markdown)}>
        <Copy size={16} />
        复制 Markdown
      </button>
    </div>
  )
}

export function SvgToReactTool() {
  const [name, setName] = useState('ToolIcon')
  const [svg, setSvg] = useState('<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#4a6cf7"/></svg>')
  const output = useMemo(() => svgToReact(svg, pascalCase(name) || 'SvgIcon'), [name, svg])

  return (
    <div className="tool-form">
      <div className="field">
        <label>组件名</label>
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="two-col">
        <div className="field">
          <label>SVG</label>
          <textarea className="textarea" value={svg} onChange={(event) => setSvg(event.target.value)} />
        </div>
        <div className="field">
          <label>React 组件</label>
          <pre className="result-box">{output}</pre>
        </div>
      </div>
      <button className="button" type="button" onClick={() => copyText(output)}>
        <Copy size={16} />
        复制组件
      </button>
    </div>
  )
}

export function JsonToRustTool() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "ToolKit",\n  "active": true,\n  "tags": ["static", "local"]\n}')
  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input)
      const root = Array.isArray(parsed) ? parsed[0] : parsed
      if (!root || typeof root !== 'object') return '请输入 JSON 对象或对象数组'
      const structs: string[] = []
      const rootStruct = buildRustStruct(root as Record<string, unknown>, 'Root', structs)
      return [...structs.reverse(), rootStruct].join('\n\n')
    } catch (error) {
      return error instanceof Error ? error.message : 'JSON 解析失败'
    }
  }, [input])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>JSON 示例</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>Rust 结构体</label>
          <pre className="result-box">{output}</pre>
        </div>
      </div>
      <button className="button" type="button" onClick={() => copyText(output)}>
        <Copy size={16} />
        复制 Rust 代码
      </button>
    </div>
  )
}

export function CodeToImageTool() {
  const [code, setCode] = useState("function hello() {\n  console.log('ToolKit')\n}")
  const [title, setTitle] = useState('snippet.ts')
  const [theme, setTheme] = useState('#111827')
  const [preview, setPreview] = useState('')

  const render = () => {
    const lines = code.split('\n')
    const canvas = document.createElement('canvas')
    const width = 980
    const lineHeight = 28
    canvas.width = width
    canvas.height = 118 + lines.length * lineHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = theme
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f43f5e'
    ctx.beginPath()
    ctx.arc(34, 34, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(58, 34, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(82, 34, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = '20px Consolas, monospace'
    ctx.fillText(title, 118, 42)
    ctx.font = '22px Consolas, monospace'
    lines.forEach((line, index) => {
      ctx.fillStyle = '#64748b'
      ctx.fillText(String(index + 1).padStart(2, '0'), 34, 92 + index * lineHeight)
      ctx.fillStyle = '#e5e7eb'
      ctx.fillText(line, 82, 92 + index * lineHeight)
    })
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
        <input className="input" type="color" value={theme} onChange={(event) => setTheme(event.target.value)} />
        <button className="button primary" type="button" onClick={render}>生成图片</button>
      </div>
      <textarea className="textarea" value={code} onChange={(event) => setCode(event.target.value)} />
      {preview && <img className="wide-preview" src={preview} alt="代码图片预览" />}
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'code.png')}><Download size={16} />下载 PNG</button>}
    </div>
  )
}

export function ImageCropTool() {
  const [preview, setPreview] = useState('')
  const [ratio, setRatio] = useState('1')

  const crop = async (file: File | null) => {
    if (!file) return
    const image = await loadImageFromFile(file)
    const numericRatio = Number(ratio)
    let width = image.naturalWidth
    let height = width / numericRatio
    if (height > image.naturalHeight) {
      height = image.naturalHeight
      width = height * numericRatio
    }
    const sourceX = (image.naturalWidth - width) / 2
    const sourceY = (image.naturalHeight - height) / 2
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width)
    canvas.height = Math.round(height)
    canvas.getContext('2d')?.drawImage(image, sourceX, sourceY, width, height, 0, 0, canvas.width, canvas.height)
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <select className="select" value={ratio} onChange={(event) => setRatio(event.target.value)}>
          <option value="1">1:1</option>
          <option value="1.7777777778">16:9</option>
          <option value="1.3333333333">4:3</option>
          <option value="0.75">3:4</option>
        </select>
        <input className="input" type="file" accept="image/*" onChange={(event) => crop(event.target.files?.[0] ?? null)} />
      </div>
      {preview && <img className="wide-preview" src={preview} alt="剪裁预览" />}
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'cropped.png')}><Scissors size={16} />下载剪裁图</button>}
    </div>
  )
}

export function QrDecodeTool() {
  const [result, setResult] = useState('')
  const [preview, setPreview] = useState('')

  const decodeImage = async (file: File | null) => {
    if (!file) return
    const image = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(image, 0, 0)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(data.data, data.width, data.height)
    setPreview(canvas.toDataURL('image/png'))
    setResult(code?.data ?? '未识别到二维码')
  }

  return (
    <div className="tool-form">
      <input className="input" type="file" accept="image/*" onChange={(event) => decodeImage(event.target.files?.[0] ?? null)} />
      {preview && <img className="wide-preview" src={preview} alt="二维码图片预览" />}
      <pre className="result-box">{result || '上传二维码图片后显示解析结果'}</pre>
      <button className="button" type="button" onClick={() => copyText(result)}>
        <Copy size={16} />
        复制结果
      </button>
    </div>
  )
}
