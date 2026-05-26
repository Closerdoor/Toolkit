import { useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

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
      <div className="field">
        <label>Image file</label>
        <input className="input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
      </div>
      <div className="field">
        <label>Base64 data URL</label>
        <textarea
          className="textarea"
          placeholder="Upload an image to generate a data:image/... Base64 URL, or paste one here to preview it."
          value={output}
          onChange={(event) => setOutput(event.target.value)}
        />
      </div>
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(output)} disabled={!output}>
          <Copy size={16} />
          Copy Base64
        </button>
      </div>
      <div className="qr-preview">
        {output.startsWith('data:image') ? (
          <img src={output} alt="Base64 image preview" style={{ maxWidth: '100%', maxHeight: 260 }} />
        ) : (
          <p className="muted">The image preview will appear here after a valid data URL is available.</p>
        )}
      </div>
    </div>
  )
}
