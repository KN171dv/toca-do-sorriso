import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { businessInfo, fullAddress } from './src/data/business.ts'
import { deliveryZones } from './src/data/delivery.ts'
import { openingHours } from './src/data/hours.ts'
import { paymentMethods } from './src/data/payments.ts'
import { featured } from './src/data/featured.ts'
import { HERO_3D } from './src/data/burger3d.ts'
import { products } from './src/data/products.ts'

/** Pré-carga da imagem do hero (LCP), conforme featured.heroVariant. */
function heroPreload(): string {
  if (featured.heroVariant === '3d') {
    return `<link rel="preload" as="image" href="${HERO_3D.src}" imagesrcset="${HERO_3D.srcSmall} ${HERO_3D.widthSmall}w, ${HERO_3D.src} ${HERO_3D.width}w" imagesizes="(min-width: 1024px) 500px, min(88vw, 38svh, 500px)" fetchpriority="high" />`
  }
  const src = products.find((p) => p.id === featured.heroProductId)?.image?.src
  return src ? `<link rel="preload" as="image" href="${src}" fetchpriority="high" />` : ''
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * SEO gerado em build a partir de src/data: canonical, Open Graph e
 * JSON-LD (Schema.org/Restaurant). Mudou endereço/horário? Só editar os dados.
 */
function seoPlugin(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/$/, '')
  const abs = (p: string) => (url ? `${url}${p}` : p)
  const a = businessInfo.address
  const geo = a.geo as { lat: number; lng: number } | null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: businessInfo.name,
    servesCuisine: ['Hambúrguer', 'Lanches'],
    image: abs('/images/brand/og.jpg'),
    logo: abs('/images/brand/logo-512.png'),
    ...(url && { url, '@id': `${url}/#restaurant`, hasMenu: `${url}/#cardapio` }),
    telephone: `+${businessInfo.phone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      addressCountry: 'BR',
      ...((a.zipcode as string) ? { postalCode: a.zipcode as string } : {}),
    },
    ...(geo ? { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } } : {}),
    openingHoursSpecification: openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS[h.day], opens: h.open, closes: h.close,
    })),
    paymentAccepted: paymentMethods.filter((p) => p.active).map((p) => p.name).join(', '),
    areaServed: deliveryZones.map((z) => z.name),
    sameAs: [businessInfo.instagram.url],
  }
  return {
    name: 'toca-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', url)
        .replaceAll('%OG_IMAGE%', abs('/images/brand/og.jpg'))
        .replaceAll('%ADDRESS%', fullAddress())
        .replace('<!--CANONICAL-->', url ? `<link rel="canonical" href="${url}/" />\n    <meta property="og:url" content="${url}/" />` : '')
        .replace('<!--HERO_PRELOAD-->', heroPreload())
        .replace('<!--JSON_LD-->', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seoPlugin(env.VITE_SITE_URL ?? '')],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
