import { useMemo, useState } from 'react'
import { downloadDataUrl } from '../utils/download'

export function PlaceholderImageTool() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(450)
  const [bg, setBg] = useState('#0f766e')
  const dataUrl = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.font = `${Math.max(24, width / 12)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${width} x ${height}`, width / 2, height / 2)
    return canvas.toDataURL('image/png')
  }, [bg, height, width])
  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        <input className="input" type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
        <input type="color" value={bg} onChange={(event) => setBg(event.target.value)} />
      </div>
      <div className="qr-preview"><img src={dataUrl} alt="占位图" style={{ maxWidth: '100%', maxHeight: 300 }} /></div>
      <button className="button" type="button" onClick={() => downloadDataUrl(dataUrl, 'placeholder.png')}>下载 PNG</button>
    </div>
  )
}
