import { useState } from 'react'
import { Download } from 'lucide-react'
import { downloadDataUrl, loadImageFromFile } from '../utils/download'

type PosterKind = 'question' | 'answer'

function drawCover(ctx: CanvasRenderingContext2D, width: number, height: number, title: string, subtitle: string) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#111827')
  gradient.addColorStop(1, '#2563eb')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(54, 54, width - 108, height - 108)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.font = 'bold 82px system-ui, sans-serif'
  ctx.fillText(title, width / 2, 118)
  ctx.font = '30px system-ui, sans-serif'
  ctx.fillText(subtitle, width / 2, height - 56)
}

function drawContainedImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, kind: PosterKind) {
  const maxWidth = width * 0.64
  const maxHeight = height * 0.58
  const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const x = (width - drawWidth) / 2
  const y = (height - drawHeight) / 2 + 28

  if (kind === 'answer') {
    ctx.shadowColor = 'rgba(0,0,0,0.28)'
    ctx.shadowBlur = 28
    ctx.drawImage(image, x, y, drawWidth, drawHeight)
    ctx.shadowBlur = 0
    return
  }

  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskCtx = mask.getContext('2d')
  if (!maskCtx) return
  maskCtx.drawImage(image, x, y, drawWidth, drawHeight)
  maskCtx.globalCompositeOperation = 'source-in'
  maskCtx.fillStyle = '#8b95a7'
  maskCtx.fillRect(0, 0, width, height)

  ctx.shadowColor = 'rgba(0,0,0,0.34)'
  ctx.shadowBlur = 32
  ctx.drawImage(mask, 0, 0)
  ctx.shadowBlur = 0
}

async function createPoster(file: File, kind: PosterKind, answer: string) {
  const image = await loadImageFromFile(file)
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 675
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  drawCover(ctx, canvas.width, canvas.height, kind === 'question' ? '我是谁？' : answer || '答案揭晓', kind === 'question' ? '猜猜这个剪影是谁' : '答案就是它')
  drawContainedImage(ctx, image, canvas.width, canvas.height, kind)
  return canvas.toDataURL('image/png')
}

export function WhoIsThatImageTool() {
  const [file, setFile] = useState<File | null>(null)
  const [answer, setAnswer] = useState('神秘角色')
  const [questionImage, setQuestionImage] = useState('')
  const [answerImage, setAnswerImage] = useState('')

  const render = async (nextFile = file) => {
    if (!nextFile) return
    setFile(nextFile)
    const [question, revealed] = await Promise.all([
      createPoster(nextFile, 'question', answer),
      createPoster(nextFile, 'answer', answer),
    ])
    setQuestionImage(question)
    setAnswerImage(revealed)
  }

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>角色图片</label>
          <input className="input" type="file" accept="image/*" onChange={(event) => render(event.target.files?.[0] ?? null)} />
        </div>
        <div className="field">
          <label>答案名称</label>
          <input className="input" value={answer} onChange={(event) => setAnswer(event.target.value)} />
        </div>
      </div>
      <button className="button primary" type="button" onClick={() => render()} disabled={!file}>重新生成</button>
      <p className="muted">上传透明背景 PNG 时，灰色轮廓效果最接近动画里的“猜猜我是谁”。普通照片也可以生成，但剪影会保留照片整体外形。</p>
      <div className="two-col">
        <div className="field">
          <label>提问图</label>
          <div className="poster-preview">{questionImage ? <img src={questionImage} alt="Who is that question poster" /> : <span>上传图片后生成剪影提问图</span>}</div>
          <button className="button" type="button" onClick={() => downloadDataUrl(questionImage, 'who-is-that-question.png')} disabled={!questionImage}>
            <Download size={16} />
            下载提问图
          </button>
        </div>
        <div className="field">
          <label>答案图</label>
          <div className="poster-preview">{answerImage ? <img src={answerImage} alt="Who is that answer poster" /> : <span>上传图片后生成答案揭晓图</span>}</div>
          <button className="button" type="button" onClick={() => downloadDataUrl(answerImage, 'who-is-that-answer.png')} disabled={!answerImage}>
            <Download size={16} />
            下载答案图
          </button>
        </div>
      </div>
    </div>
  )
}
