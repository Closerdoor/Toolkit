import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Base64Tool,
  Bip39GeneratorTool,
  DockerRunComposeTool,
  IntegerBaseConverterTool,
  IbanValidatorTool,
  JsonDiffTool,
  JsonFormatterTool,
  JsonToXmlTool,
  MarkdownToHtmlTool,
  OtpGeneratorTool,
  PhoneParserTool,
  RomanNumeralConverterTool,
  SafelinkDecoderTool,
  TextStatsTool,
} from '../../src/tools'

function textareas() {
  return screen.getAllByRole('textbox') as HTMLTextAreaElement[]
}

describe('representative tool behavior', () => {
  it('formats valid JSON and reports parsed content', () => {
    render(<JsonFormatterTool />)
    fireEvent.change(textareas()[0], { target: { value: '{"b":2,"a":1}' } })
    expect(screen.getByText(/"b": 2/)).toBeInTheDocument()
    expect(screen.getByText(/"a": 1/)).toBeInTheDocument()
  })

  it('encodes and decodes Base64 text', () => {
    render(<Base64Tool />)
    fireEvent.change(textareas()[0], { target: { value: 'hello' } })
    expect(screen.getByText('aGVsbG8=')).toBeInTheDocument()
  })

  it('counts text characters and lines', () => {
    render(<TextStatsTool />)
    fireEvent.change(textareas()[0], { target: { value: 'one\ntwo' } })
    expect(screen.getByText(/行数/)).toBeInTheDocument()
    expect(screen.getByText(/2/)).toBeInTheDocument()
  })

  it('converts integer bases', () => {
    render(<IntegerBaseConverterTool />)
    fireEvent.change(screen.getByDisplayValue('255'), { target: { value: '16' } })
    expect(screen.getByText(/HEX\s+10/)).toBeInTheDocument()
    expect(screen.getByText(/BIN\s+10000/)).toBeInTheDocument()
  })

  it('converts roman numerals both ways', () => {
    render(<RomanNumeralConverterTool />)
    expect(screen.getByText('MCMXCIV')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('1994'), { target: { value: 'XLII' } })
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows structural JSON diffs by path', () => {
    render(<JsonDiffTool />)
    expect(screen.getByText(/\$\.count: 1 -> 2/)).toBeInTheDocument()
    expect(screen.getByText(/\$\.local: undefined -> true/)).toBeInTheDocument()
  })

  it('converts JSON to XML', () => {
    render(<JsonToXmlTool />)
    expect(screen.getByText(/<tool>/)).toBeInTheDocument()
    expect(screen.getByText(/<name>ToolKit<\/name>/)).toBeInTheDocument()
  })

  it('converts Markdown to HTML', () => {
    render(<MarkdownToHtmlTool />)
    expect(screen.getByText(/<h1>ToolKit<\/h1>/)).toBeInTheDocument()
    expect(screen.getByText(/<strong>bold<\/strong>/)).toBeInTheDocument()
  })

  it('converts docker run options to compose yaml', () => {
    render(<DockerRunComposeTool />)
    expect(screen.getByText(/services:/)).toBeInTheDocument()
    expect(screen.getByText(/image: nginx:latest/)).toBeInTheDocument()
    expect(screen.getAllByText(/8080:80/).length).toBeGreaterThan(0)
  })

  it('decodes Safe Links URLs', () => {
    render(<SafelinkDecoderTool />)
    expect(screen.getByText('https://example.com/docs')).toBeInTheDocument()
  })

  it('validates IBAN values', () => {
    render(<IbanValidatorTool />)
    expect(screen.getByText(/"valid": true/)).toBeInTheDocument()
    expect(screen.getByText(/"country": "GB"/)).toBeInTheDocument()
  })

  it('parses phone numbers with an offline library', () => {
    render(<PhoneParserTool />)
    expect(screen.getByText(/"valid": true/)).toBeInTheDocument()
    expect(screen.getByText(/\+1 415 555 2671/)).toBeInTheDocument()
  })

  it('generates a valid BIP39 mnemonic', () => {
    render(<Bip39GeneratorTool />)
    expect(screen.getByText(/助记词有效/)).toBeInTheDocument()
  })

  it('generates a TOTP code from a base32 secret', async () => {
    render(<OtpGeneratorTool />)
    await waitFor(() => {
      expect(screen.getByText(/\d{6}/)).toBeInTheDocument()
    })
  })
})
