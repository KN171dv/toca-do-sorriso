// Prepara o asset "hambúrguer 3D" (vista explodida do Duplo Bacon) para o site.
//
//   npm run burger:build            → usa o recorte em cache (design/burger-3d/cutout.png)
//   npm run burger:build -- --fresh → refaz a remoção de fundo (precisa do modelo, ver abaixo)
//
// Etapas
//  1. Localiza a imagem enviada ("hambúrguer 3D.png" em upload/, na raiz, em public/ ou src/)
//     e move para public/images/burger/hamburguer-3d.<ext> (original preservado).
//  2. Gera WebP otimizados da imagem inteira (1254 e 640px).
//  3. Remove o fundo com @imgly/background-removal-node — ferramenta só de
//     desenvolvimento, instalada sob demanda: `npm i --no-save @imgly/background-removal-node`.
//     O resultado fica em design/burger-3d/cutout.png para não depender do modelo de novo.
//  4. Apaga os pontos/linhas dos rótulos que vieram desenhados sobre a comida.
//  5. Separa 6 camadas por cor + faixa vertical (pão, maionese, bacon, cheddar+carne ×2, pão)
//     e exporta WebP transparentes em public/images/burger-layers/ + a geometria em
//     src/data/burger3d.ts. Montado = camadas aproximadas (ASSEMBLE_DY); aberto = foto original.
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const DEST_DIR = 'public/images/burger'
const CUTOUT = 'design/burger-3d/cutout.png'
const LAYERS_DIR = 'public/images/burger-layers'
const fresh = process.argv.includes('--fresh')

// ── 1. localizar e renomear ────────────────────────────────────────────────
const isAsset = (f) => /hamb[uú]rguer[\s_-]*3d\.(png|jpe?g|webp)$/i.test(f.normalize('NFC'))
let source = readdirSync(DEST_DIR, { withFileTypes: true }).find((d) => /^hamburguer-3d\.(png|jpe?g|webp)$/.test(d.name))
let sourcePath = source && join(DEST_DIR, source.name)
if (!sourcePath) {
  for (const dir of ['upload', 'uploads', '.', 'public', 'src']) {
    if (!existsSync(dir)) continue
    const hit = readdirSync(dir).find(isAsset)
    if (hit) {
      sourcePath = join(DEST_DIR, `hamburguer-3d${extname(hit).toLowerCase()}`)
      mkdirSync(DEST_DIR, { recursive: true })
      renameSync(join(dir, hit), sourcePath)
      console.log(`✓ ${dir}/${hit} → ${sourcePath}`)
      break
    }
  }
}
if (!sourcePath) {
  console.error('✗ Imagem "hambúrguer 3D" não encontrada (upload/, raiz, public/, src/).')
  process.exit(1)
}

// ── 2. WebP da imagem inteira ──────────────────────────────────────────────
for (const width of [1254, 640]) {
  const out = join(DEST_DIR, width === 1254 ? 'hamburguer-3d.webp' : `hamburguer-3d-${width}.webp`)
  await sharp(sourcePath).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  console.log('✓', out)
}

// ── 3. remoção de fundo (cache) ────────────────────────────────────────────
if (fresh || !existsSync(CUTOUT)) {
  let removeBackground
  try {
    ;({ removeBackground } = await import('@imgly/background-removal-node'))
  } catch {
    console.error('✗ Rode antes: npm i --no-save @imgly/background-removal-node')
    process.exit(1)
  }
  const { readFileSync } = await import('node:fs')
  const blob = await removeBackground(new Blob([readFileSync(sourcePath)], { type: 'image/png' }), {
    model: 'medium',
    output: { format: 'image/png', quality: 1 },
  })
  mkdirSync('design/burger-3d', { recursive: true })
  writeFileSync(CUTOUT, Buffer.from(await blob.arrayBuffer()))
  console.log('✓ fundo removido →', CUTOUT)
}

const { data, info } = await sharp(CUTOUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const W = info.width, H = info.height, N = W * H
const lum = (i) => (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3

// ── 4. limpar marcas dos rótulos sobre a comida ────────────────────────────
// Caixas (x0, y0, x1, y1) medidas nesta imagem: pontos-guia e início das linhas.
const LABEL_MARKS = [[820, 124, 838, 140], [824, 559, 878, 576], [825, 781, 842, 798], [824, 884, 842, 900], [824, 1043, 884, 1059]]
for (const [x0, y0, x1, y1] of LABEL_MARKS) {
  const bad = new Set()
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = y * W + x, r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
    if (data[i * 4 + 3] > 0 && Math.min(r, g, b) > 140 && Math.max(r, g, b) - Math.min(r, g, b) < 70) bad.add(i)
  }
  for (const i of [...bad]) for (const d of [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1]) bad.add(i + d)
  // interpolação vertical (as marcas são finas e horizontais)
  for (const i of bad) {
    const x = i % W, y = (i / W) | 0
    let up = y, dn = y
    while (bad.has(up * W + x)) up--
    while (bad.has(dn * W + x)) dn++
    const t = (y - up) / (dn - up)
    for (let c = 0; c < 4; c++) data[i * 4 + c] = Math.round(data[(up * W + x) * 4 + c] * (1 - t) + data[(dn * W + x) * 4 + c] * t)
  }
}

// Sombra escura nas frestas (pão/maionese e carne/pão de baixo) vira transparência.
{
  const bands = [[276, 302], [936, 976]]
  const inBand = (y) => bands.some(([a, b]) => y >= a && y <= b)
  const cleared = new Uint8Array(N)
  let q = []
  for (let i = 0; i < N; i++) if (data[i * 4 + 3] < 8 && inBand((i / W) | 0)) q.push(i)
  while (q.length) {
    const nq = []
    for (const i of q) for (const j of [i - 1, i + 1, i - W, i + W]) {
      if (j < 0 || j >= N || cleared[j] || !inBand((j / W) | 0) || data[j * 4 + 3] < 8) continue
      if (lum(j) < 34) { cleared[j] = 1; data[j * 4 + 3] = 0; nq.push(j) }
    }
    q = nq
  }
  const a = new Uint8Array(N)
  for (let i = 0; i < N; i++) a[i] = data[i * 4 + 3]
  for (let i = W; i < N - W; i++) {
    if (a[i] && (cleared[i - 1] || cleared[i + 1] || cleared[i - W] || cleared[i + W])) {
      data[i * 4 + 3] = Math.round((a[i] * 4 + a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) / 8)
    }
  }
}

// ── 5. separar camadas ─────────────────────────────────────────────────────
// De cima para baixo; a de cima fica na frente. ASSEMBLE_DY = quanto cada peça desce
// (px da imagem original) para formar o hambúrguer montado — ajustado no olho.
const PIECES = ['pao-topo', 'maionese', 'bacon', 'carne-1', 'carne-2', 'pao-base']
const ASSEMBLE_DY = [272, 205, 160, 105, 40, 0]
const SMALL = 0.62

const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]]
const isMayo = (i) => { const [r, g, b, a] = px(i); return a > 120 && (r + g + b) / 3 > 110 && g > 0.8 * r && b > 0.5 * r }
// maionese = pixels claros conectados à mancha principal (os brilhos do bacon ficam de fora)
const mayoSet = new Uint8Array(N)
{
  let q = [330 * W + 540]
  mayoSet[q[0]] = 1
  while (q.length) {
    const nq = []
    for (const i of q) for (const j of [i - 1, i + 1, i - W, i + W]) {
      const y = (j / W) | 0
      if (!mayoSet[j] && y > 260 && y < 470 && isMayo(j)) { mayoSet[j] = 1; nq.push(j) }
    }
    q = nq
  }
  for (let k = 0; k < 3; k++) { // fecha os poros (pimenta)
    const add = []
    for (let i = W; i < N - W; i++) if (!mayoSet[i] && data[i * 4 + 3] > 120 && mayoSet[i - 1] + mayoSet[i + 1] + mayoSet[i - W] + mayoSet[i + W] >= 3) add.push(i)
    for (const i of add) mayoSet[i] = 1
  }
}

const label = new Int8Array(N).fill(-1) // -2 transparente · -1 indefinido
for (let i = 0; i < N; i++) {
  const [r, g, b, a] = px(i)
  if (a < 8) { label[i] = -2; continue }
  if (a < 160) continue
  const y = (i / W) | 0, L = (r + g + b) / 3
  const mayo = L > 120 && g > 0.82 * r && b > 0.55 * r
  const cheese = r > 170 && g > 0.5 * r && g < 0.85 * r && b < 0.45 * r
  if (mayoSet[i]) label[i] = 1
  else if (y < 310 && !mayo) label[i] = 0
  else if (!mayo && !cheese && y >= 375 && y < 520) label[i] = 2
  else if (cheese && y >= 505 && y < 720) label[i] = 3
  else if (!cheese && y >= 600 && y < 735) label[i] = 3
  else if (cheese && y >= 742 && y < 905) label[i] = 4
  else if (!cheese && y >= 800 && y < 950) label[i] = 4
  else if (y > 962 && L > 70) label[i] = 5
  else if (y > 990) label[i] = 5
}
// pixels ambíguos herdam o rótulo do vizinho mais próximo
for (let q = Array.from({ length: N }, (_, i) => i).filter((i) => label[i] >= 0); q.length;) {
  const nq = []
  for (const i of q) for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && label[j] === -1) { label[j] = label[i]; nq.push(j) }
  q = nq
}

mkdirSync(LAYERS_DIR, { recursive: true })
const boxes = []
for (let p = 0; p < PIECES.length; p++) {
  // Pixels próprios + anel de 3px (alfa decrescente) sob as peças da frente: sem frestas
  // quando montado, e sem "costura" visível quando a peça da frente se afasta.
  let ring = new Uint8Array(N)
  for (let i = 0; i < N; i++) if (label[i] === p) ring[i] = 1
  for (let k = 1; k <= 3; k++) {
    const next = ring.slice()
    for (let i = W; i < N - W; i++) {
      if (ring[i] || label[i] < 0 || label[i] >= p) continue
      if (ring[i - 1] || ring[i + 1] || ring[i - W] || ring[i + W]) next[i] = k + 1
    }
    ring = next
  }
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  const buf = Buffer.alloc(N * 4)
  for (let i = 0; i < N; i++) {
    if (!ring[i]) continue
    for (let c = 0; c < 3; c++) buf[i * 4 + c] = data[i * 4 + c]
    buf[i * 4 + 3] = Math.round(data[i * 4 + 3] * (ring[i] === 1 ? 1 : 1 - (ring[i] - 1) / 4))
    const x = i % W, y = (i / W) | 0
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  const box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
  const piece = sharp(buf, { raw: { width: W, height: H, channels: 4 } }).extract({ left: box.x, top: box.y, width: box.w, height: box.h })
  const png = await piece.png().toBuffer()
  // -sm ≈ 62%: cobre o palco do celular (≈250px CSS × DPR 1,75); telas densas/desktop usam a inteira
  for (const [suffix, scale] of [['', 1], ['-sm', SMALL]]) {
    const out = `${LAYERS_DIR}/3d-${PIECES[p]}${suffix}.webp`
    await sharp(png).resize({ width: Math.round(box.w * scale) }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out)
  }
  boxes.push({ id: PIECES[p], ...box, dy: ASSEMBLE_DY[p], png })
  console.log(`✓ ${PIECES[p]} ${box.w}×${box.h}`)
}

// ── geometria → src/data/burger3d.ts ───────────────────────────────────────
// Quadro = hambúrguer montado. `spread` = deslocamento (em % da altura do quadro)
// que leva cada peça da posição montada até a posição da foto original (aberto),
// com os dois estados centralizados no mesmo ponto.
const fx0 = Math.min(...boxes.map((b) => b.x)), fx1 = Math.max(...boxes.map((b) => b.x + b.w))
const ay0 = Math.min(...boxes.map((b) => b.y + b.dy)), ay1 = Math.max(...boxes.map((b) => b.y + b.h + b.dy))
const ey0 = Math.min(...boxes.map((b) => b.y)), ey1 = Math.max(...boxes.map((b) => b.y + b.h))
const FW = fx1 - fx0, FH = ay1 - ay0

// Hambúrguer montado inteiro (variante '3d' do hero): peças compostas na posição montada,
// de baixo para cima (a de cima fica na frente), com fundo transparente.
const assembled = await sharp({ create: { width: FW, height: FH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([...boxes].reverse().map((b) => ({ input: b.png, left: b.x - fx0, top: b.y + b.dy - ay0 })))
  .png().toBuffer()
const HERO_SMALL = 0.66
for (const [suffix, scale] of [['', 1], ['-sm', HERO_SMALL]]) {
  const out = `${DEST_DIR}/hamburguer-3d-montado${suffix}.webp`
  await sharp(assembled).resize({ width: Math.round(FW * scale) }).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(out)
  console.log('✓', out)
}
const shift = (ay0 + ay1) / 2 - (ey0 + ey1) / 2
const r = (n) => Math.round(n * 100) / 100
const rows = boxes.map((b) => {
  const pct = { x: r(((b.x - fx0) / FW) * 100), y: r(((b.y + b.dy - ay0) / FH) * 100), w: r((b.w / FW) * 100), h: r((b.h / FH) * 100), spread: r(((shift - b.dy) / FH) * 100) }
  return `  { id: '${b.id}', src: '/images/burger-layers/3d-${b.id}.webp', srcSmall: '/images/burger-layers/3d-${b.id}-sm.webp', width: ${b.w}, height: ${b.h}, widthSmall: ${Math.round(b.w * SMALL)}, x: ${pct.x}, y: ${pct.y}, w: ${pct.w}, h: ${pct.h}, spread: ${pct.spread} },`
})
writeFileSync(join(ROOT, 'src/data/burger3d.ts'), `// Gerado por scripts/burger-3d.mjs — não editar à mão.
// Camadas recortadas de public/images/burger/hamburguer-3d.png (vista explodida do Duplo Bacon).

export interface BurgerPiece {
  id: string
  src: string
  srcSmall: string
  /** Tamanho do arquivo em px (e largura da versão -sm). */
  width: number
  height: number
  widthSmall: number
  /** Caixa da peça no hambúrguer montado, em % do quadro (x/w da largura, y/h da altura). */
  x: number
  y: number
  w: number
  h: number
  /** Deslocamento vertical até a posição "aberto" (foto original), em % da altura do quadro. */
  spread: number
}

/** Proporção largura/altura do quadro (hambúrguer montado). */
export const BURGER_FRAME_RATIO = ${r(FW / FH)}
/** Altura extra do estado totalmente aberto, em % da altura do quadro. */
export const BURGER_MAX_SPREAD = ${r(((ey1 - ey0 - FH) / FH) * 100)}

/** Hambúrguer montado inteiro (recorte sem fundo) — variante '3d' do hero. */
export const HERO_3D = {
  src: '/images/burger/hamburguer-3d-montado.webp',
  srcSmall: '/images/burger/hamburguer-3d-montado-sm.webp',
  width: ${FW},
  height: ${FH},
  widthSmall: ${Math.round(FW * HERO_SMALL)},
  alt: 'Duplo Bacon montado: pão brioche, maionese temperada, bacon, cheddar e duas carnes de 100g (imagem ilustrativa)',
} as const

export const burgerPieces: BurgerPiece[] = [
${rows.join('\n')}
]
`)
console.log('✓ src/data/burger3d.ts')
