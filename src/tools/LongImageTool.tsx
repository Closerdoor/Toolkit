import { useState } from 'react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

export function LongImageTool() {
  const [preview, setPreview] = useState('')

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const images = await Promise.all(Array.from(files).map(loadImageFromFile))
    const width = Math.max(...images.map((image) => image.naturalWidth))
    const height = images.reduce((sum, image) => sum + image.naturalHeight * (width / image.naturalWidth), 0)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let y = 0
    images.forEach((image) => {
      const h = image.naturalHeight * (width / image.naturalWidth)
      ctx.drawImage(image, 0, y, width, h)
      y += h
    })
    setPreview(canvas.toDataURL('image/png'))
  }

  return (
    <div className="tool-form">
      <div className="field">
        <label>Images to stitch</label>
        <input className="input" type="file" accept="image/*" multiple onChange={(event) => handleFiles(event.target.files)} />
      </div>
      <div className="qr-preview">
        {preview ? (
          <img src={preview} alt="Long image preview" style={{ maxWidth: '100%', maxHeight: 420 }} />
        ) : (
          <p className="muted">Upload multiple images to combine them vertically into one long PNG.</p>
        )}
      </div>
      <button className="button" type="button" onClick={() => downloadDataUrl(preview, 'long-image.png')} disabled={!preview}>
        Download long image
      </button>
    </div>
  )
}
