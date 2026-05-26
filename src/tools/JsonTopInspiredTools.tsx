import { useMemo, useRef, useState } from 'react'
import { Copy, Download, Play, RotateCcw } from 'lucide-react'
import { copyText } from '../utils/clipboard'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

async function digestText(text: string, algorithm: AlgorithmIdentifier) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algorithm, data)
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(text: string) {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0))
}

async function getAesKey(password: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password || 'toolkit'))
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

export function HtmlPreviewTool() {
  const [html, setHtml] = useState('<main class="card">\\n  <h1>Hello ToolKit</h1>\\n  <p>Edit HTML, CSS and JavaScript here.</p>\\n</main>')
  const [css, setCss] = useState('body { font-family: system-ui; padding: 32px; background: #f5f7ff; }\\n.card { padding: 24px; border-radius: 16px; background: white; box-shadow: 0 12px 32px #dbe4ff; }')
  const [js, setJs] = useState("document.querySelector('h1').style.color = '#4a6cf7'")

  const srcDoc = `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`

  return (
    <div className="tool-form">
      <div className="three-col">
        <div className="field">
          <label>HTML</label>
          <textarea className="textarea" value={html} onChange={(event) => setHtml(event.target.value)} />
        </div>
        <div className="field">
          <label>CSS</label>
          <textarea className="textarea" value={css} onChange={(event) => setCss(event.target.value)} />
        </div>
        <div className="field">
          <label>JavaScript</label>
          <textarea className="textarea" value={js} onChange={(event) => setJs(event.target.value)} />
        </div>
      </div>
      <iframe className="html-preview-frame" title="HTML 预览" sandbox="allow-scripts" srcDoc={srcDoc} />
    </div>
  )
}

export function CryptoTool() {
  const [input, setInput] = useState('ToolKit')
  const [password, setPassword] = useState('toolkit-secret')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('')

  const runDigest = async (algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') => {
    setOutput(await digestText(input, algorithm))
    setStatus(`${algorithm} 摘要已生成`)
  }

  const encrypt = async () => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await getAesKey(password)
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(input))
    setOutput(`${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`)
    setStatus('AES-GCM 加密完成')
  }

  const decrypt = async () => {
    try {
      const [ivText, payloadText] = input.split('.')
      const key = await getAesKey(password)
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(ivText) }, key, fromBase64(payloadText))
      setOutput(new TextDecoder().decode(decrypted))
      setStatus('AES-GCM 解密完成')
    } catch {
      setStatus('解密失败，请检查密文和密码')
    }
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>输入内容 / AES 密文</label>
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="field">
          <label>密码</label>
          <input className="input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
      </div>
      <div className="button-row">
        {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map((algorithm) => (
          <button className="button" key={algorithm} type="button" onClick={() => runDigest(algorithm)}>
            {algorithm}
          </button>
        ))}
        <button className="button primary" type="button" onClick={encrypt}>AES 加密</button>
        <button className="button" type="button" onClick={decrypt}>AES 解密</button>
      </div>
      {status && <p className="status">{status}</p>}
      <pre className="result-box">{output || '结果会显示在这里'}</pre>
      <button className="button" type="button" onClick={() => copyText(output)}>
        <Copy size={16} />
        复制结果
      </button>
    </div>
  )
}

const emojis = ['😀', '😂', '🥰', '😎', '😭', '👍', '🙏', '🎉', '🔥', '✨', '❤️', '💡', '✅', '⚠️', '🚀', '🧰', '📌', '📷', '🎨', '🎮', '🍀', '☕', '🌙', '⭐', '🏆', '🧪', '🔐', '🧭', '📝', '💻']

export function EmojiPickerTool() {
  const [query, setQuery] = useState('')
  const visible = emojis.filter((emoji) => emoji.includes(query.trim()))

  return (
    <div className="tool-form">
      <input className="input" placeholder="搜索或直接浏览 Emoji" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="emoji-grid">
        {visible.map((emoji) => (
          <button className="emoji-tile" key={emoji} type="button" onClick={() => copyText(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
      <p className="status">点击任意 Emoji 即可复制。</p>
    </div>
  )
}

export function NineGridTool() {
  const [pieces, setPieces] = useState<string[]>([])

  const splitImage = async (file: File | null) => {
    if (!file) return
    const image = await loadImageFromFile(file)
    const size = Math.min(image.naturalWidth, image.naturalHeight)
    const startX = (image.naturalWidth - size) / 2
    const startY = (image.naturalHeight - size) / 2
    const cell = Math.floor(size / 3)
    const nextPieces: string[] = []
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const canvas = document.createElement('canvas')
        canvas.width = cell
        canvas.height = cell
        canvas.getContext('2d')?.drawImage(image, startX + col * cell, startY + row * cell, cell, cell, 0, 0, cell, cell)
        nextPieces.push(canvas.toDataURL('image/png'))
      }
    }
    setPieces(nextPieces)
  }

  return (
    <div className="tool-form">
      <div className="field">
        <label>Source image</label>
        <input className="input" type="file" accept="image/*" onChange={(event) => splitImage(event.target.files?.[0] ?? null)} />
      </div>
      <div className="nine-grid-preview">
        {pieces.length > 0 ? (
          pieces.map((piece, index) => (
            <button className="nine-grid-piece" key={piece} type="button" onClick={() => downloadDataUrl(piece, `nine-grid-${index + 1}.png`)}>
              <img src={piece} alt={`Nine-grid slice ${index + 1}`} />
            </button>
          ))
        ) : (
          <p className="muted">Upload an image to crop the centered square and export it as nine equal PNG slices.</p>
        )}
      </div>
      <p className="status">{pieces.length > 0 ? 'Click any slice to download that PNG.' : 'Ready to split an image into a 3 x 3 grid.'}</p>
    </div>
  )
}

export function CoverCreatorTool() {
  const [title, setTitle] = useState('ToolKit 灵感记录')
  const [subtitle, setSubtitle] = useState('A small utility workspace')
  const [color, setColor] = useState('#4a6cf7')
  const [preview, setPreview] = useState('')

  const render = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, '#16db93')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(255,255,255,0.16)'
    ctx.fillRect(70, 70, 1060, 490)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 72px system-ui'
    ctx.fillText(title, 120, 285, 960)
    ctx.font = '32px system-ui'
    ctx.fillText(subtitle, 124, 360, 960)
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
        <input className="input" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
        <input className="input" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
      </div>
      <button className="button primary" type="button" onClick={render}>生成封面</button>
      {preview && <img className="wide-preview" src={preview} alt="封面预览" />}
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'cover.png')}><Download size={16} />下载 PNG</button>}
    </div>
  )
}

export function SubtitleScreenshotTool() {
  const [caption, setCaption] = useState('这里是一句醒目的字幕')
  const [preview, setPreview] = useState('')
  const fileRef = useRef<File | null>(null)

  const render = async (file = fileRef.current) => {
    if (!file) return
    fileRef.current = file
    const image = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(image, 0, 0)
    ctx.font = `bold ${Math.max(28, canvas.width / 18)}px system-ui`
    ctx.textAlign = 'center'
    ctx.lineWidth = Math.max(5, canvas.width / 180)
    ctx.strokeStyle = '#000'
    ctx.fillStyle = '#fff'
    ctx.strokeText(caption, canvas.width / 2, canvas.height - canvas.height * 0.1)
    ctx.fillText(caption, canvas.width / 2, canvas.height - canvas.height * 0.1)
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" type="file" accept="image/*" onChange={(event) => render(event.target.files?.[0] ?? null)} />
        <input className="input" value={caption} onChange={(event) => setCaption(event.target.value)} />
      </div>
      <button className="button primary" type="button" onClick={() => render()}>生成字幕截图</button>
      {preview && <img className="wide-preview" src={preview} alt="字幕截图预览" />}
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'caption-image.png')}><Download size={16} />下载 PNG</button>}
    </div>
  )
}

export function SvgWorkflowTool() {
  const [title, setTitle] = useState('ToolKit Workflow')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="360" viewBox="0 0 900 360"><rect width="900" height="360" rx="28" fill="#f5f7ff"/><g font-family="system-ui" font-size="18" font-weight="700" text-anchor="middle"><rect x="80" y="135" width="160" height="90" rx="18" fill="#e0f2fe"/><text x="160" y="188" fill="#026aa2">输入</text><rect x="370" y="135" width="160" height="90" rx="18" fill="#ecfdf3"/><text x="450" y="188" fill="#027a48">${title}</text><rect x="660" y="135" width="160" height="90" rx="18" fill="#fdf2fa"/><text x="740" y="188" fill="#c11574">导出</text></g><path d="M250 180h100" stroke="#4a6cf7" stroke-width="4" marker-end="url(#a)"/><path d="M540 180h100" stroke="#4a6cf7" stroke-width="4" marker-end="url(#a)"/><defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill="#4a6cf7"/></marker></defs></svg>`
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

  return (
    <div className="tool-form">
      <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
      <div className="svg-workflow-preview" dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(svg)}><Copy size={16} />复制 SVG</button>
        <a className="button" href={dataUrl} download="workflow.svg"><Download size={16} />下载 SVG</a>
      </div>
    </div>
  )
}

export function NumberSlidePuzzleTool() {
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0])
  const empty = tiles.indexOf(0)
  const won = tiles.join(',') === '1,2,3,4,5,6,7,8,0'
  const move = (index: number) => {
    const canMove = [empty - 1, empty + 1, empty - 3, empty + 3].includes(index) && Math.abs((empty % 3) - (index % 3)) <= 1
    if (!canMove) return
    setTiles((current) => {
      const next = [...current]
      ;[next[empty], next[index]] = [next[index], next[empty]]
      return next
    })
  }
  const shuffle = () => setTiles([1, 3, 6, 4, 2, 8, 7, 5, 0])

  return (
    <div className="tool-form">
      <div className="puzzle-board">
        {tiles.map((tile, index) => (
          <button className={`puzzle-tile ${tile === 0 ? 'empty' : ''}`} key={`${tile}-${index}`} type="button" onClick={() => move(index)}>
            {tile || ''}
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="button primary" type="button" onClick={shuffle}><RotateCcw size={16} />打乱</button>
        <button className="button" type="button" onClick={() => setTiles([1, 2, 3, 4, 5, 6, 7, 8, 0])}>复原</button>
      </div>
      <p className="status">{won ? '拼图已完成。' : '移动数字块，把它们排回正确顺序。'}</p>
    </div>
  )
}

export function MathAdventureTool() {
  const [a, setA] = useState(7)
  const [b, setB] = useState(8)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const submit = () => {
    if (Number(answer) === a * b) setScore((value) => value + 1)
    setA(Math.ceil(Math.random() * 12))
    setB(Math.ceil(Math.random() * 12))
    setAnswer('')
  }
  return (
    <div className="mini-game-panel">
      <h3>{a} x {b} = ?</h3>
      <input className="input" value={answer} onChange={(event) => setAnswer(event.target.value)} />
      <button className="button primary" type="button" onClick={submit}><Play size={16} />提交</button>
      <p className="status">得分：{score}</p>
    </div>
  )
}

export function InfiniteShootingTool() {
  const [score, setScore] = useState(0)
  return (
    <div className="mini-game-panel shooting-game">
      <button className="target-button" type="button" onClick={() => setScore((value) => value + 1)}>命中</button>
      <p>点击目标练习反应速度。</p>
      <strong>分数：{score}</strong>
    </div>
  )
}

export function InfiniteDefenseTool() {
  const [wall, setWall] = useState(5)
  const [wave, setWave] = useState(1)
  return (
    <div className="mini-game-panel">
      <h3>第 {wave} 波</h3>
      <progress max={10} value={wall} />
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setWall((value) => Math.min(10, value + 1))}>加固</button>
        <button className="button" type="button" onClick={() => { setWave((value) => value + 1); setWall((value) => Math.max(0, value - 2)) }}>下一波</button>
      </div>
    </div>
  )
}

export function GlyphCasterTool() {
  const [glyphs, setGlyphs] = useState<string[]>([])
  const spell = glyphs.join(' ')
  return (
    <div className="tool-form">
      <div className="glyph-pad">
        {['△', '○', '□', '✦', '✧', '✺'].map((glyph) => (
          <button className="glyph-button" key={glyph} type="button" onClick={() => setGlyphs((current) => [...current, glyph])}>{glyph}</button>
        ))}
      </div>
      <pre className="result-box">{spell || '点击符文组合你的法术'}</pre>
      <button className="button" type="button" onClick={() => setGlyphs([])}>清空</button>
    </div>
  )
}

export function SphereEngineerTool() {
  const [plants, setPlants] = useState(4)
  const [water, setWater] = useState(5)
  const balance = useMemo(() => Math.max(0, 100 - Math.abs(plants - water) * 14), [plants, water])
  return (
    <div className="mini-game-panel">
      <h3>生态平衡：{balance}%</h3>
      <label>植物 {plants}<input type="range" min="0" max="10" value={plants} onChange={(event) => setPlants(Number(event.target.value))} /></label>
      <label>水分 {water}<input type="range" min="0" max="10" value={water} onChange={(event) => setWater(Number(event.target.value))} /></label>
      <p className="status">让植物和水分保持接近，生态瓶会更稳定。</p>
    </div>
  )
}

export function SpriteSelectorTool() {
  const sprites = ['🍄', '🪙', '💎', '🧱', '🌲', '🔥', '💧', '⚡', '🛡️', '🗝️', '🚪', '⭐']
  const [selected, setSelected] = useState<string[]>([])
  return (
    <div className="tool-form">
      <div className="emoji-grid">
        {sprites.map((sprite) => (
          <button className="emoji-tile" key={sprite} type="button" onClick={() => setSelected((current) => [...current, sprite])}>
            {sprite}
          </button>
        ))}
      </div>
      <pre className="result-box">{selected.join(' ') || '点击精灵素材，把它们加入当前选择。'}</pre>
      <button className="button" type="button" onClick={() => copyText(selected.join(' '))}><Copy size={16} />复制选择</button>
    </div>
  )
}

export function PathArchitectTool() {
  const [path, setPath] = useState<string[]>(['起点'])
  const add = (step: string) => setPath((current) => [...current, step])
  return (
    <div className="tool-form">
      <div className="button-row">
        {['向上', '向右', '向下', '向左', '桥梁', '终点'].map((step) => (
          <button className="button" key={step} type="button" onClick={() => add(step)}>{step}</button>
        ))}
      </div>
      <div className="path-preview">{path.map((step, index) => <span key={`${step}-${index}`}>{step}</span>)}</div>
      <button className="button" type="button" onClick={() => setPath(['起点'])}>重置路径</button>
    </div>
  )
}
