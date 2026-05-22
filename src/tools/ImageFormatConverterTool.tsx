import { useState } from 'react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

export function ImageFormatConverterTool() {
  const [format, setFormat] = useState('image/webp')
  const [preview, setPreview] = useState('')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const image = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.getContext('2d')?.drawImage(image, 0, 0)
    setPreview(canvas.toDataURL(format, 0.9))
  }

  const ext = format.split('/')[1]
  return (
    <div className="tool-form">
      <select className="select" value={format} onChange={(event) => setFormat(event.target.value)}>
        <option value="image/webp">WebP</option>
        <option value="image/png">PNG</option>
        <option value="image/jpeg">JPG</option>
      </select>
      <input className="input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
      <div className="qr-preview">{preview && <img src={preview} alt="转换预览" style={{ maxWidth: '100%', maxHeight: 280 }} />}</div>
      {preview && <button className="button" type="button" onClick={() => downloadDataUrl(preview, `converted.${ext}`)}>下载</button>}
    </div>
  )
}
