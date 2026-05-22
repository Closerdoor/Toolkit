import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export function QrCodeTool() {
  const [text, setText] = useState('https://example.com')
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(text || ' ', { width: 220, margin: 2 }).then(setDataUrl)
  }, [text])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>二维码内容</label>
          <textarea className="textarea" value={text} onChange={(event) => setText(event.target.value)} />
        </div>
        <div className="qr-preview">{dataUrl && <img src={dataUrl} alt="生成的二维码" width="220" height="220" />}</div>
      </div>
      {dataUrl && (
        <a className="button" href={dataUrl} download="toolkit-qrcode.png">
          下载 PNG
        </a>
      )}
    </div>
  )
}
