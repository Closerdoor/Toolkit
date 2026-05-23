import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

const sourcePath = resolve(process.argv[2] ?? '3df5de6b-9c2f-477b-813f-21ed1b932913.htm')
const outputDir = resolve(process.argv[3] ?? 'style-reports')

const html = await readFile(sourcePath, 'utf8')

const compact = (value) => value.replace(/\s+/g, ' ').trim()
const prettyHtml = (value) => value.replace(/></g, '>\n<').trim()
const unique = (items) => [...new Set(items.filter(Boolean))]

function snippetAround(needle, before = 1200, after = 2400) {
  const index = html.indexOf(needle)
  if (index < 0) return null
  return prettyHtml(html.slice(Math.max(0, index - before), index + after))
}

function extractBetween(startNeedle, endNeedle, fallbackLength = 5000) {
  const start = html.indexOf(startNeedle)
  if (start < 0) return null
  const end = html.indexOf(endNeedle, start)
  return prettyHtml(html.slice(start, end > start ? end : start + fallbackLength))
}

function extractCssRules(keywords) {
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1])
  const rules = []

  for (const styleText of styles) {
    const ruleMatches = styleText.match(/[^{}]+{[^{}]*}/g) ?? []
    for (const rule of ruleMatches) {
      if (keywords.some((keyword) => rule.includes(keyword))) {
        rules.push(compact(rule))
      }
    }
  }

  return unique(rules)
}

function extractVariables(names) {
  return Object.fromEntries(
    names.map((name) => {
      const match = html.match(new RegExp(`${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:\\s*([^;}]+)`))
      return [name, match ? match[1].trim() : null]
    }),
  )
}

function extractLabels(tabsDom) {
  if (!tabsDom) return []
  return [...tabsDom.matchAll(/role=tab[^>]*>([^<]+)<\/div>/g)].map((match) => compact(match[1]))
}

function extractCardSamples() {
  const cardStart = html.indexOf('ui-card ui-card-bordered ui-card-hoverable ui-card-middle pui-components-app-public-item-index-card')
  if (cardStart < 0) return null

  const firstCardStart = html.lastIndexOf('<div', cardStart)
  const firstCardEnd = html.indexOf('<div style=width:25%;max-width:25%>', cardStart + 1)
  const cardDom = html.slice(firstCardStart, firstCardEnd > firstCardStart ? firstCardEnd : firstCardStart + 6500)

  return {
    dom: prettyHtml(cardDom),
    inlineHeight: [...cardDom.matchAll(/style=height:([^ >]+)/g)].map((match) => match[1]),
    title: cardDom.match(/<h3 class=pui-components-app-public-item-index-cardTitle>([\s\S]*?)<\/h3>/)?.[1]?.trim() ?? null,
    description: compact(cardDom.match(/<p class="pui-components-app-public-item-index-description[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ''),
    tags: [...cardDom.matchAll(/pui-components-app-public-item-index-tag"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/g)]
      .map((match) => compact(match[1].replace(/<[^>]+>/g, ''))),
  }
}

const tabsDom = extractBetween(
  '<div class="ui-tabs ui-tabs-top ui-tabs-middle ui-tabs-full-content ui-tabs-full-content--scrollable pui-components-app-explorer-index-explorerTabBar">',
  '<div class=ui-tabs-content-holder>',
)

const searchDom = extractBetween(
  '<div class=pui-pages-app-main-discover-apps-index-appSearchWrapper>',
  '<div class=pui-pages-app-main-discover-apps-index-mainWrapper>',
)

const bannerDom = snippetAround('pui-pages-app-main-discover-apps-index-appSearchWrapper', 2200, 1600)
const card = extractCardSamples()

const css = {
  tabs: extractCssRules([
    '.ui-tabs',
    'pui-components-app-explorer-index-explorerTabBar',
    '--ui-tabs',
  ]),
  search: extractCssRules([
    'pui-pages-app-main-discover-apps-index',
    'appSearch',
    'ui-input-affix-wrapper',
    'ui-btn-primary',
  ]),
  cards: extractCssRules([
    'pui-components-app-public-item-index',
    '.ui-card',
    '.ui-tag',
    '.ui-avatar',
  ]),
}

const variables = extractVariables([
  '--ui-font-size-base',
  '--ui-font-size-lg',
  '--ui-font-weight-semibold',
  '--ui-line-height-base',
  '--ui-tabs-active-color',
  '--ui-tabs-bar-margin',
  '--ui-tabs-color',
  '--ui-tabs-highlight-color',
  '--ui-tabs-horizontal-gutter',
  '--ui-tabs-horizontal-padding',
  '--ui-tabs-hover-color',
  '--ui-tabs-ink-bar-color',
  '--ui-tabs-title-font-size',
  '--ui-border-color-split',
  '--ui-fill-4',
  '--ui-primary-color',
  '--app-primary-base',
  '--app-primary-3',
])

const report = {
  source: basename(sourcePath),
  generatedAt: new Date().toISOString(),
  note: 'Extracted statically from the saved SingleFile HTML. Browser file navigation was blocked by policy, so this report uses DOM snippets, inline styles, CSS variables, and shipped CSS rules instead of runtime computed styles.',
  channels: extractLabels(tabsDom),
  structure: {
    searchAndTabsSeparated: Boolean(searchDom && tabsDom && html.indexOf(searchDom.replace(/\n/g, '')) < html.indexOf(tabsDom.replace(/\n/g, ''))),
    searchDom,
    tabsDom,
    bannerDom,
    cardDom: card?.dom ?? null,
  },
  variables,
  css,
  card: {
    inlineHeight: card?.inlineHeight ?? [],
    title: card?.title ?? null,
    description: card?.description ?? null,
    tags: card?.tags ?? [],
  },
}

const markdown = `# Anakin Style Extraction

Source: \`${report.source}\`  
Generated: \`${report.generatedAt}\`

> ${report.note}

## Key Findings

- Search/banner and channel tabs are separate DOM sections.
- Channel navigation uses Ant-style \`.ui-tabs\`, not pill chips.
- The tab row has a bottom divider via \`.ui-tabs-nav:before\`.
- Active state uses \`.ui-tabs-ink-bar\` with \`--ui-tabs-ink-bar-color\`.
- App cards use \`.ui-card\` plus \`.pui-components-app-public-item-index-card\`.
- Card body padding is defined as \`16px\`.
- Card height appears inline as \`${report.card.inlineHeight.join(', ') || 'not found'}\`.

## Channels

${report.channels.map((label) => `- ${label}`).join('\n')}

## CSS Variables

\`\`\`json
${JSON.stringify(report.variables, null, 2)}
\`\`\`

## Tabs DOM

\`\`\`html
${report.structure.tabsDom ?? 'not found'}
\`\`\`

## Search DOM

\`\`\`html
${report.structure.searchDom ?? 'not found'}
\`\`\`

## First Card DOM

\`\`\`html
${report.structure.cardDom ?? 'not found'}
\`\`\`

## Tabs CSS Rules

\`\`\`css
${report.css.tabs.join('\n')}
\`\`\`

## Search CSS Rules

\`\`\`css
${report.css.search.join('\n')}
\`\`\`

## Card CSS Rules

\`\`\`css
${report.css.cards.join('\n')}
\`\`\`
`

await mkdir(outputDir, { recursive: true })
await writeFile(resolve(outputDir, 'anakin-style-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
await writeFile(resolve(outputDir, 'anakin-style-report.md'), markdown, 'utf8')

console.log(`Wrote ${resolve(outputDir, 'anakin-style-report.json')}`)
console.log(`Wrote ${resolve(outputDir, 'anakin-style-report.md')}`)
