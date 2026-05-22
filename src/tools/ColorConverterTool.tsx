import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const delta = max - min
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / delta + 2
        break
      default:
        h = (r - g) / delta + 4
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorConverterTool() {
  const [hex, setHex] = useState('#0f766e')
  const values = useMemo(() => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return {
      hex: `#${hex.replace('#', '').toUpperCase()}`,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    }
  }, [hex])

  return (
    <div className="tool-form">
      <div className="two-col">
        <div className="field">
          <label>HEX 颜色</label>
          <input className="input" value={hex} onChange={(event) => setHex(event.target.value)} />
          <input type="color" value={values?.hex ?? '#000000'} onChange={(event) => setHex(event.target.value)} />
        </div>
        <div className="color-preview">
          <div className="color-swatch" style={{ background: values?.hex ?? 'transparent' }} />
        </div>
      </div>
      <pre className="result-box">{values ? `${values.hex}\n${values.rgb}\n${values.hsl}` : '请输入 6 位 HEX 颜色，例如 #0f766e'}</pre>
      <button className="button" type="button" onClick={() => values && copyText(`${values.hex}\n${values.rgb}\n${values.hsl}`)}>
        <Copy size={16} />
        复制颜色值
      </button>
    </div>
  )
}
