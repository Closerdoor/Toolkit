import { useState } from 'react'

export function ImageBase64Tool() {
  const [output, setOutput] = useState('')
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setOutput(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <div className="tool-form">
      <input className="input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
      <textarea className="textarea" value={output} onChange={(event) => setOutput(event.target.value)} />
      {output.startsWith('data:image') && <div className="qr-preview"><img src={output} alt="Base64 图片预览" style={{ maxWidth: '100%', maxHeight: 260 }} /></div>}
    </div>
  )
}
