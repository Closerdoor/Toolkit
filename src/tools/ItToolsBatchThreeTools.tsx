import { useEffect, useMemo, useState } from 'react'
import bcrypt from 'bcryptjs'
import { generateMnemonic, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { friendlyFormatIBAN, isValidIBAN } from 'ibantools'
import { Copy, KeyRound, RefreshCw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

function copyButton(value: string, label = '复制结果') {
  return <button className="button" type="button" onClick={() => copyText(value)}><Copy size={16} />{label}</button>
}

function bytesToBase64(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
}

function pem(label: string, bytes: ArrayBuffer) {
  const body = bytesToBase64(bytes).match(/.{1,64}/g)?.join('\n') ?? ''
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`
}

function base32Decode(input: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const char of input.toUpperCase().replace(/=|\s/g, '')) {
    const index = alphabet.indexOf(char)
    if (index >= 0) bits += index.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(Number.parseInt(bits.slice(i, i + 8), 2))
  return new Uint8Array(bytes)
}

async function hotp(secret: string, counter: number, digits = 6) {
  const key = await crypto.subtle.importKey('raw', base32Decode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  view.setUint32(4, counter)
  const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, buffer))
  const offset = hmac[hmac.length - 1] & 0xf
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3]
  return String(code % 10 ** digits).padStart(digits, '0')
}

export function OtpGeneratorTool() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP')
  const [now, setNow] = useState(() => Date.now())
  const [code, setCode] = useState('')
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    hotp(secret, Math.floor(now / 30000)).then(setCode).catch(() => setCode('Secret 无效'))
  }, [now, secret])
  const remaining = 30 - Math.floor((now / 1000) % 30)
  return <div className="tool-form"><input className="input" value={secret} onChange={(event) => setSecret(event.target.value)} /><pre className="result-box">{code}\n剩余 {remaining}s</pre>{copyButton(code)}</div>
}

export function RsaKeyPairGeneratorTool() {
  const [result, setResult] = useState('点击按钮生成 RSA-OAEP 密钥对')
  const generate = async () => {
    const pair = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
    const publicKey = await crypto.subtle.exportKey('spki', pair.publicKey)
    const privateKey = await crypto.subtle.exportKey('pkcs8', pair.privateKey)
    setResult(`${pem('PUBLIC KEY', publicKey)}\n\n${pem('PRIVATE KEY', privateKey)}`)
  }
  return <div className="tool-form"><pre className="result-box">{result}</pre><button className="button primary" type="button" onClick={generate}><KeyRound size={16} />生成 RSA 密钥对</button>{copyButton(result)}</div>
}

export function BcryptTool() {
  const [input, setInput] = useState('toolkit-secret')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  return (
    <div className="tool-form">
      <div className="two-col">
        <input className="input" value={input} onChange={(event) => setInput(event.target.value)} />
        <input className="input" type="number" min="4" max="12" value={rounds} onChange={(event) => setRounds(Number(event.target.value))} />
      </div>
      <pre className="result-box">{hash || '点击生成 bcrypt hash'}</pre>
      <button className="button primary" type="button" onClick={() => setHash(bcrypt.hashSync(input, rounds))}>生成 Hash</button>
      {copyButton(hash)}
    </div>
  )
}

export function Bip39GeneratorTool() {
  const [strength, setStrength] = useState<128 | 160 | 192 | 224 | 256>(128)
  const [mnemonic, setMnemonic] = useState(() => generateMnemonic(wordlist, 128))
  const valid = validateMnemonic(mnemonic, wordlist)
  return (
    <div className="tool-form">
      <select className="select" value={strength} onChange={(event) => setStrength(Number(event.target.value) as typeof strength)}>
        <option value="128">12 words</option>
        <option value="160">15 words</option>
        <option value="192">18 words</option>
        <option value="224">21 words</option>
        <option value="256">24 words</option>
      </select>
      <textarea className="textarea" value={mnemonic} onChange={(event) => setMnemonic(event.target.value)} />
      <div className={`status ${valid ? 'success' : 'error'}`}>{valid ? '助记词有效' : '助记词无效'}</div>
      <button className="button primary" type="button" onClick={() => setMnemonic(generateMnemonic(wordlist, strength))}><RefreshCw size={16} />重新生成</button>
      {copyButton(mnemonic)}
    </div>
  )
}

export function PdfSignatureCheckerTool() {
  const [result, setResult] = useState('请选择 PDF 文件')
  const inspect = async (file: File) => {
    const text = new TextDecoder('latin1').decode(await file.arrayBuffer())
    const signed = /\/ByteRange\s*\[/.test(text) && /\/Contents\s*</.test(text)
    const fields = (text.match(/\/Type\s*\/Sig/g) ?? []).length
    setResult(JSON.stringify({ file: file.name, size: file.size, signed, signatureFields: fields }, null, 2))
  }
  return <div className="tool-form"><input className="input" type="file" accept="application/pdf" onChange={(event) => event.target.files?.[0] && inspect(event.target.files[0])} /><pre className="result-box">{result}</pre>{copyButton(result)}</div>
}

export function PhoneParserTool() {
  const [input, setInput] = useState('+1 415 555 2671')
  const [country, setCountry] = useState('US')
  const output = useMemo(() => {
    const phone = parsePhoneNumberFromString(input, country as never)
    if (!phone) return '无法解析手机号'
    return JSON.stringify({ valid: phone.isValid(), country: phone.country, type: phone.getType(), international: phone.formatInternational(), national: phone.formatNational(), uri: phone.getURI() }, null, 2)
  }, [country, input])
  return <div className="tool-form"><div className="two-col"><input className="input" value={input} onChange={(event) => setInput(event.target.value)} /><input className="input" value={country} onChange={(event) => setCountry(event.target.value.toUpperCase())} /></div><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function IbanValidatorTool() {
  const [input, setInput] = useState('GB82 WEST 1234 5698 7654 32')
  const compact = input.replace(/\s/g, '').toUpperCase()
  const output = JSON.stringify({ valid: isValidIBAN(compact), formatted: friendlyFormatIBAN(compact), country: compact.slice(0, 2), checksum: compact.slice(2, 4) }, null, 2)
  return <div className="tool-form"><input className="input" value={input} onChange={(event) => setInput(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function SafelinkDecoderTool() {
  const [input, setInput] = useState('https://nam01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fdocs&data=...')
  const output = useMemo(() => {
    try {
      const url = new URL(input)
      return decodeURIComponent(url.searchParams.get('url') || url.searchParams.get('u') || input)
    } catch {
      return input
    }
  }, [input])
  return <div className="tool-form"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function EmailNormalizerTool() {
  const [input, setInput] = useState('First.Last+newsletter@gmail.com')
  const output = useMemo(() => {
    const [local = '', domain = ''] = input.trim().toLowerCase().split('@')
    if (!domain) return '请输入有效邮箱'
    const normalizedLocal = domain === 'gmail.com' || domain === 'googlemail.com' ? local.split('+')[0].replace(/\./g, '') : local.split('+')[0]
    return `${normalizedLocal}@${domain === 'googlemail.com' ? 'gmail.com' : domain}`
  }, [input])
  return <div className="tool-form"><input className="input" value={input} onChange={(event) => setInput(event.target.value)} /><pre className="result-box">{output}</pre>{copyButton(output)}</div>
}

export function MacAddressLookupTool() {
  const [input, setInput] = useState('00:1A:2B:00:00:00')
  const vendors: Record<string, string> = {
    '00:1A:2B': 'Ayecom Technology',
    '00:1B:63': 'Apple',
    '00:1C:B3': 'Apple',
    '3C:5A:B4': 'Google',
    'F4:F5:D8': 'Google',
    '00:50:56': 'VMware',
    '08:00:27': 'Oracle VirtualBox',
    '00:15:5D': 'Microsoft Hyper-V',
  }
  const prefix = input.toUpperCase().replace(/-/g, ':').split(':').slice(0, 3).join(':')
  const output = vendors[prefix] ?? '内置示例库未收录该 OUI，可后续接入完整离线表。'
  return <div className="tool-form"><input className="input" value={input} onChange={(event) => setInput(event.target.value)} /><pre className="result-box">{prefix}: {output}</pre>{copyButton(output)}</div>
}
