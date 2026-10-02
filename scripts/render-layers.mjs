// Rasteriza as camadas ilustradas do hambúrguer (design/burger-layers/*.svg)
// para WebP com fundo transparente em public/images/burger-layers.
// Uso: node scripts/render-layers.mjs   (requer `playwright` e `sharp`)
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')) }
const SRC = 'design/burger-layers', OUT = 'public/images/burger-layers'
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1.25 })
for (const f of readdirSync(SRC).filter((f) => f.endsWith('.svg'))) {
  const svg = readFileSync(`${SRC}/${f}`, 'utf8')
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/)
  await page.setViewportSize({ width: +w, height: +h })
  await page.setContent(`<body style="margin:0;background:transparent">${svg}</body>`)
  const png = await page.screenshot({ omitBackground: true })
  await sharp(png).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/${f.replace('.svg', '.webp')}`)
  console.log('✓', f, `${w}x${h}`)
}
await browser.close()
