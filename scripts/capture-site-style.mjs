import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const url = process.argv[2]
const outputDir = resolve(process.argv[3] ?? 'style-reports/site-capture')

if (!url) {
  console.error('Usage: node scripts/capture-site-style.mjs <url> [output-dir]')
  process.exit(1)
}

const desktopViewport = { width: 1440, height: 1100 }
const mobileViewport = { width: 390, height: 844 }
const waitMs = Number(process.env.CAPTURE_WAIT_MS ?? 2500)

const network = []

function sanitizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

async function capturePage(page, suffix) {
  await page.screenshot({
    path: resolve(outputDir, `screenshot-${suffix}.png`),
    fullPage: true,
  })

  const html = await page.content()
  await writeFile(resolve(outputDir, `page-${suffix}.html`), html, 'utf8')

  const designSnapshot = await page.evaluate(() => {
    const visibleElements = [...document.querySelectorAll('body *')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        const style = window.getComputedStyle(element)
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
      })
      .slice(0, 1200)

    const colorCounts = new Map()
    const fontCounts = new Map()
    const radiusCounts = new Map()
    const shadowCounts = new Map()
    const spacingCounts = new Map()

    function addCount(map, value) {
      if (!value || value === 'none' || value === '0px' || value === 'normal') return
      map.set(value, (map.get(value) ?? 0) + 1)
    }

    const elements = visibleElements.map((element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      const selector =
        element.id
          ? `#${element.id}`
          : `${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? `.${element.className.trim().split(/\s+/).slice(0, 3).join('.')}` : ''}`

      addCount(colorCounts, style.color)
      addCount(colorCounts, style.backgroundColor)
      addCount(colorCounts, style.borderColor)
      addCount(fontCounts, `${style.fontFamily} / ${style.fontSize} / ${style.fontWeight}`)
      addCount(radiusCounts, style.borderRadius)
      addCount(shadowCounts, style.boxShadow)
      addCount(spacingCounts, style.padding)
      addCount(spacingCounts, style.margin)
      addCount(spacingCounts, style.gap)

      return {
        selector,
        text: element instanceof HTMLElement ? element.innerText?.trim().slice(0, 120) : '',
        role: element.getAttribute('role'),
        ariaLabel: element.getAttribute('aria-label'),
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        styles: {
          display: style.display,
          position: style.position,
          color: style.color,
          backgroundColor: style.backgroundColor,
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`,
          padding: style.padding,
          margin: style.margin,
          gap: style.gap,
          border: `${style.borderWidth} ${style.borderStyle} ${style.borderColor}`,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
        },
      }
    })

    function topEntries(map, limit = 30) {
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([value, count]) => ({ value, count }))
    }

    return {
      title: document.title,
      url: location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      tokens: {
        colors: topEntries(colorCounts),
        fonts: topEntries(fontCounts),
        radii: topEntries(radiusCounts),
        shadows: topEntries(shadowCounts),
        spacing: topEntries(spacingCounts),
      },
      landmarks: [...document.querySelectorAll('header, nav, main, aside, footer, section, [role]')]
        .slice(0, 160)
        .map((element) => {
          const rect = element.getBoundingClientRect()
          return {
            tag: element.tagName.toLowerCase(),
            role: element.getAttribute('role'),
            className: element.getAttribute('class'),
            text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 160),
            rect: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
          }
        }),
      elements,
    }
  })

  await writeFile(resolve(outputDir, `design-snapshot-${suffix}.json`), `${JSON.stringify(designSnapshot, null, 2)}\n`, 'utf8')

  return designSnapshot
}

async function captureCdp(page) {
  const client = await page.context().newCDPSession(page)
  await client.send('DOM.enable')
  await client.send('CSS.enable')
  await client.send('Page.enable')

  const { root } = await client.send('DOM.getDocument', { depth: -1, pierce: true })
  await writeFile(resolve(outputDir, 'cdp-dom.json'), `${JSON.stringify(root, null, 2)}\n`, 'utf8')

  const candidateSelectors = [
    'header',
    'nav',
    'main',
    'aside',
    'section',
    'button',
    'input',
    'a',
    '[role="tab"]',
    '[role="button"]',
    '[class*="card" i]',
    '[class*="tab" i]',
    '[class*="search" i]',
  ]

  const nodes = []
  for (const selector of candidateSelectors) {
    const handles = await page.locator(selector).elementHandles().catch(() => [])
    for (const handle of handles.slice(0, 30)) {
      const objectId = handle._elementChannel?._object?.guid
      const elementInfo = await handle.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return {
          selector: element.id
            ? `#${element.id}`
            : `${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? `.${element.className.trim().split(/\s+/).slice(0, 4).join('.')}` : ''}`,
          text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 160),
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        }
      })
      const { object } = await client.send('Runtime.evaluate', {
        expression: `document.querySelector(${JSON.stringify(elementInfo.selector.startsWith('#') ? elementInfo.selector : selector)})`,
      }).catch(() => ({ object: null }))

      let matchedRules = null
      let computedStyle = null

      if (object?.objectId) {
        const { nodeId } = await client.send('DOM.requestNode', { objectId: object.objectId }).catch(() => ({ nodeId: null }))
        if (nodeId) {
          matchedRules = await client.send('CSS.getMatchedStylesForNode', { nodeId }).catch(() => null)
          computedStyle = await client.send('CSS.getComputedStyleForNode', { nodeId }).catch(() => null)
        }
      }

      nodes.push({
        selector,
        element: elementInfo,
        cdp: {
          matchedRules,
          computedStyle,
        },
      })
    }
  }

  await writeFile(resolve(outputDir, 'cdp-styles.json'), `${JSON.stringify(nodes, null, 2)}\n`, 'utf8')
}

function makeMarkdown(desktop, mobile) {
  const colorList = desktop.tokens.colors
    .slice(0, 16)
    .map((item) => `- \`${item.value}\` (${item.count})`)
    .join('\n')
  const fontList = desktop.tokens.fonts
    .slice(0, 12)
    .map((item) => `- \`${item.value}\` (${item.count})`)
    .join('\n')
  const landmarkList = desktop.landmarks
    .slice(0, 24)
    .map((item) => `- ${item.tag}${item.role ? ` [${item.role}]` : ''}: ${item.rect.width}x${item.rect.height} at ${item.rect.x},${item.rect.y} - ${sanitizeText(item.text).slice(0, 90)}`)
    .join('\n')

  return `# Site Capture Report

URL: ${url}

## Outputs

- \`screenshot-desktop.png\`
- \`screenshot-mobile.png\`
- \`page-desktop.html\`
- \`page-mobile.html\`
- \`design-snapshot-desktop.json\`
- \`design-snapshot-mobile.json\`
- \`cdp-dom.json\`
- \`cdp-styles.json\`
- \`network.json\`

## Desktop

- Title: ${desktop.title}
- Viewport: ${desktop.viewport.width}x${desktop.viewport.height}

## Mobile

- Title: ${mobile.title}
- Viewport: ${mobile.viewport.width}x${mobile.viewport.height}

## Frequent Colors

${colorList}

## Frequent Fonts

${fontList}

## Main Structure

${landmarkList}
`
}

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: desktopViewport,
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true,
})
const page = await context.newPage()

page.on('requestfinished', async (request) => {
  const response = await request.response().catch(() => null)
  network.push({
    method: request.method(),
    url: request.url(),
    resourceType: request.resourceType(),
    status: response?.status() ?? null,
    contentType: response?.headers()['content-type'] ?? null,
  })
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(async () => {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
})
await page.waitForTimeout(waitMs)

const desktop = await capturePage(page, 'desktop')
await captureCdp(page)

await page.setViewportSize(mobileViewport)
await page.waitForTimeout(800)
const mobile = await capturePage(page, 'mobile')

await writeFile(resolve(outputDir, 'network.json'), `${JSON.stringify(network, null, 2)}\n`, 'utf8')
await writeFile(resolve(outputDir, 'summary.md'), makeMarkdown(desktop, mobile), 'utf8')

await browser.close()

console.log(`Captured ${url}`)
console.log(`Wrote ${outputDir}`)
