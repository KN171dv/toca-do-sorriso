// Gera public/images/brand/og.jpg (1200×630): imagem que aparece quando o link é
// colado no WhatsApp/Instagram. Nome em texto na tipografia do site (Anton + Barlow)
// e a foto real do hambúrguer — sem o selo, porque o arquivo do logo diz "TOCA DD".
//
//   node scripts/og-image.mjs
//
// Renderiza um HTML com Playwright (ferramenta só de desenvolvimento):
//   npm i --no-save playwright && npx playwright install chromium
// ou aponte para uma instalação existente: PLAYWRIGHT_MODULE=/caminho/node_modules/playwright
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright'))
} catch {
  console.error('✗ Playwright não encontrado. Rode: npm i --no-save playwright && npx playwright install chromium')
  process.exit(1)
}

// Textos e foto vêm dos dados do site (nada inventado).
const { businessInfo } = await import(pathToFileURL(resolve('src/data/business.ts')).href).catch(() => ({ businessInfo: null }))
// fontes embutidas (uma página criada com setContent não lê arquivos file://)
const font = (f) => `data:font/woff2;base64,${readFileSync(resolve('public/fonts', f)).toString('base64')}`
const photo = `data:image/webp;base64,${readFileSync('public/images/products/big-sorriso.webp').toString('base64')}`
const place = businessInfo ? `${businessInfo.address.neighborhood}, ${businessInfo.address.state}` : 'Mendanha, RJ'

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Anton; src: url('${font('anton.woff2')}'); }
@font-face { font-family: Barlow; src: url('${font('barlow-600.woff2')}'); font-weight: 600; }
@font-face { font-family: Barlow; src: url('${font('barlow-700.woff2')}'); font-weight: 700; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0d0907; color: #f6e7ce; font-family: Barlow, sans-serif; position: relative; }
.glow { position: absolute; inset: 0; background:
  radial-gradient(60% 80% at 78% 100%, rgba(224,102,26,.42), transparent 62%),
  radial-gradient(40% 50% at 12% 0%, rgba(245,138,42,.10), transparent 70%); }
.spark { position: absolute; border-radius: 50%; background: #f9a03f; box-shadow: 0 0 8px 2px rgba(245,138,42,.6); }
.copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; }
.eyebrow { font-weight: 700; font-size: 18px; letter-spacing: .2em; text-transform: uppercase; color: #f9a03f; }
h1 { font-family: Anton, Impact, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .92; font-size: 112px; letter-spacing: .01em; margin-top: 18px; color: #fbf3e4; }
h1 span { color: #f58a2a; }
.sub { font-weight: 700; font-size: 20px; letter-spacing: .42em; text-transform: uppercase; color: #cfbfa3; margin-top: 14px; }
.cta { margin-top: 34px; font-weight: 600; font-size: 26px; color: #cfbfa3; }
.cta b { color: #fbf3e4; }
.photo { position: absolute; right: 70px; top: 65px; width: 500px; height: 500px; border-radius: 36px;
  box-shadow: 0 40px 90px -30px rgba(70,22,4,.95), 0 0 70px -10px rgba(224,102,26,.4); }
</style></head><body>
<div class="glow"></div>
${[[640, 560, 3], [700, 140, 2], [1150, 90, 3], [1120, 520, 5], [610, 300, 2], [90, 560, 2]].map(([x, y, s]) => `<i class="spark" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${s > 4 ? 0.45 : 0.8}"></i>`).join('')}
<div class="copy">
  <p class="eyebrow">Hambúrguer artesanal · ${place}</p>
  <h1>Toca do<br><span>Sorriso</span></h1>
  <p class="sub">na brasa</p>
  <p class="cta">Peça pelo site: <b>entrega ou retirada</b>.</p>
</div>
<img class="photo" src="${photo}" alt="">
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile('public/images/brand/og.jpg')
console.log('✓ public/images/brand/og.jpg (1200×630)')
