/**
 * Informações da empresa — fonte: página pública no InstaDelivery
 * (instadelivery.com.br/tocadosorrisorj), auditada em 02/10/2026.
 * Campos vazios ("") = não disponíveis publicamente → configurar depois.
 */
export const businessInfo = {
  name: 'Toca do Sorriso na Brasa',
  shortName: 'Toca do Sorriso',
  cuisine: 'Hambúrguer',
  welcome: 'Seja bem-vindo(a) à Toca do Sorriso na Brasa.',
  address: {
    street: 'Rua Marcolino da Costa, Lt 28, Loja E',
    neighborhood: 'Mendanha',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipcode: '', // não informado
    reference: 'Próximo ao Bazar Paraty, ao lado da Heliar',
    /** Coordenadas para SEO local / mapa — não informadas. */
    geo: null as null | { lat: number; lng: number },
  },
  phone: '5521965153899',
  whatsapp: '5521970316536',
  instagram: {
    handle: '@toca_do_sorriso',
    url: 'https://instagram.com/toca_do_sorriso',
  },
  /** URL pública do site (canonical/OG). Definir em .env → VITE_SITE_URL. */
  siteUrl: import.meta.env?.VITE_SITE_URL ?? '',
  legacyOrderUrl: 'https://instadelivery.com.br/tocadosorrisorj',
  logo: '/images/brand/logo.webp',
} as const

export function formatPhone(raw: string): string {
  const d = raw.replace(/^55/, '')
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function fullAddress(): string {
  const a = businessInfo.address
  return `${a.street} — ${a.neighborhood}, ${a.city} – ${a.state}`
}
