// Pré-renderiza a página (SSG): injeta o HTML do React em dist/index.html.
// Resultado: conteúdo visível antes do JS (FCP/LCP melhores) e indexável.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const file = 'dist/index.html'
const html = readFileSync(file, 'utf8')
if (!html.includes('<!--APP-->')) throw new Error('Marcador <!--APP--> não encontrado em dist/index.html')
writeFileSync(file, html.replace('<!--APP-->', render()))
rmSync('dist-ssr', { recursive: true, force: true })
console.log('✓ HTML pré-renderizado em', file)
