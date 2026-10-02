// Baixa as fotos ORIGINAIS do InstaDelivery (campo `remote` de cada produto)
// e regera os WebP em public/images/products (640px e 320px).
// As imagens do repositório foram capturadas da tela; rode este script uma
// vez para substituí-las pelos arquivos originais.  Uso: npm run images:fetch
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const src = readFileSync('src/data/products.ts', 'utf8')
const bases = { CDN: src.match(/const CDN = '([^']+)'/)[1], S3: src.match(/const S3 = '([^']+)'/)[1] }
const jobs = new Map()
for (const m of src.matchAll(/img\('([^']+)',\s*(CDN|S3) \+ '([^']+)'/g)) jobs.set(m[1], bases[m[2]] + m[3])

for (const [slug, url] of jobs) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await sharp(buf).resize(640, 640, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/images/products/${slug}.webp`)
    await sharp(buf).resize(320, 320, { fit: 'inside' }).webp({ quality: 78 }).toFile(`public/images/products/${slug}-sm.webp`)
    console.log('✓', slug)
  } catch (err) {
    console.warn('✗', slug, err.message)
  }
}
