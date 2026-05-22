import { useState } from 'react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

export function ImageCompressorTool() {
  const [quality, setQuality] = useState(0.75)
  const [preview, setPreview] = useState('')
  const [info, setInfo] = useState('请选择图片')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const image = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.getContext('2d')?.drawImage(image, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    setPreview(dataUrl)
    setInfo(`原始 ${(file.size / 1024).toFixed(1)} KB，导出约 ${(dataUrl.length * 0.75 / 1024).toFixed(1)} KB`)
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>图片</label>
          <input className="input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
          <label>质量 {Math.round(quality * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
          <p className="status">{info}</p>
        </div>
        <div className="qr-preview">{preview && <img src={preview} alt="压缩预览" style={{ maxWidth: '100%', maxHeight: 260 }} />}</div>
      </div>
      {preview && (
        <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'compressed.jpg')}>
          下载 JPG
        </button>
      )}
    </div>
  )
}
