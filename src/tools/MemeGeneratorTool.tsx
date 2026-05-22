import { useState } from 'react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

export function MemeGeneratorTool() {
  const [top, setTop] = useState('今天也要')
  const [bottom, setBottom] = useState('好好用工具')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const render = async (nextFile = file) => {
    if (!nextFile) return
    const image = await loadImageFromFile(nextFile)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(image, 0, 0)
    ctx.font = `bold ${Math.max(28, canvas.width / 12)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.lineWidth = Math.max(4, canvas.width / 160)
    ctx.strokeStyle = '#000'
    ctx.fillStyle = '#fff'
    ;[
      [top, canvas.height * 0.13],
      [bottom, canvas.height * 0.9],
    ].forEach(([text, y]) => {
      ctx.strokeText(String(text), canvas.width / 2, Number(y))
      ctx.fillText(String(text), canvas.width / 2, Number(y))
    })
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="file" accept="image/*" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setFile(selected); render(selected) }} />
        <input className="input" value={top} onChange={(event) => setTop(event.target.value)} />
        <input className="input" value={bottom} onChange={(event) => setBottom(event.target.value)} />
      </div>
      <button className="button primary" type="button" onClick={() => render()}>生成表情包</button>
      <div className="qr-preview">{preview && <img src={preview} alt="表情包预览" style={{ maxWidth: '100%', maxHeight: 320 }} />}</div>
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'meme.png')}>下载 PNG</button>}
    </div>
  )
}
