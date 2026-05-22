import { useState } from 'react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

export function ImageResizerTool() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const render = async (nextFile = file) => {
    if (!nextFile) return
    const image = await loadImageFromFile(nextFile)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height)
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="three-col">
        <input className="input" type="file" accept="image/*" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setFile(selected); render(selected) }} />
        <input className="input" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        <input className="input" type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
      </div>
      <button className="button primary" type="button" onClick={() => render()}>
        生成预览
      </button>
      <div className="qr-preview">{preview && <img src={preview} alt="尺寸调整预览" style={{ maxWidth: '100%', maxHeight: 300 }} />}</div>
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'resized.png')}>下载 PNG</button>}
    </div>
  )
}
