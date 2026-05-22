import { useMemo, useState } from 'react'

function ipToNum(ip: string) {
  return ip.split('.').reduce((sum, part) => (sum << 8) + Number(part), 0) >>> 0
}

function numToIp(num: number) {
  return [24, 16, 8, 0].map((shift) => (num >>> shift) & 255).join('.')
}

export function IpCidrTool() {
  const [input, setInput] = useState('192.168.1.10/24')
  const output = useMemo(() => {
    try {
      const [ip, prefixText] = input.split('/')
      const prefix = Number(prefixText)
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
      const network = ipToNum(ip) & mask
      const broadcast = network | (~mask >>> 0)
      return `掩码: ${numToIp(mask)}\n网络地址: ${numToIp(network)}\n广播地址: ${numToIp(broadcast)}\n可用数量: ${Math.max(0, broadcast - network - 1)}`
    } catch {
      return '请输入 IPv4/CIDR，例如 192.168.1.10/24'
    }
  }, [input])

  return (
    <div className="tool-form">
      <input className="input" value={input} onChange={(event) => setInput(event.target.value)} />
      <pre className="result-box">{output}</pre>
    </div>
  )
}
