import { useMemo, useState } from 'react'
import { downloadDataUrl } from '../utils/download'

export function FaviconGeneratorTool() {
  const [text, setText] = useState('T')
  const [bg, setBg] = useState('#0f766e')
  const dataUrl = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 150px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text.slice(0, 2).toUpperCase(), 128, 136)
    return canvas.toDataURL('image/png')
  }, [bg, text])

  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" value={text} onChange={(event) => setText(event.target.value)} />
        <input type="color" value={bg} onChange={(event) => setBg(event.target.value)} />
      </div>
      <div className="qr-preview">{dataUrl && <img src={dataUrl} alt="favicon 预览" width="128" height="128" />}</div>
      <button className="button" type="button" onClick={() => downloadDataUrl(dataUrl, 'favicon.png')}>下载 PNG</button>
    </div>
  )
}
