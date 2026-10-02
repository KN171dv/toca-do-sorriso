export type Money = number // sempre em reais (ex.: 24.99)

export interface Category {
  id: string
  name: string
  /** Texto curto exibido no topo da categoria (opcional). */
  tagline?: string
  image?: string
  order: number
  active: boolean
}

export interface Addon {
  id: string
  name: string
  description?: string
  price: Money
  /** Quantidade máxima por item. */
  max: number
  active: boolean
}

export type ProductBadge = 'mais-pedido' | 'mais-vendido' | 'novidade'

export interface ProductImage {
  /** Caminho local otimizado (public/). */
  src: string
  /** Versão reduzida para listagens. */
  srcSmall?: string
  /** URL original no InstaDelivery — usada por scripts/fetch-images.mjs. */
  remote?: string
  alt: string
}

export interface Product {
  id: string
  /** id do item no InstaDelivery (rastreabilidade da migração). */
  sourceId?: number
  categoryId: string
  name: string
  description: string
  price: Money
  /** Preço "de" (riscado), quando há promoção. */
  compareAtPrice?: Money
  image?: ProductImage
  badges: ProductBadge[]
  addonIds: string[]
  /** Controle de disponibilidade (futuro admin). */
  active: boolean
  order: number
}

export interface DeliveryZone {
  id: string
  name: string
  fee: Money
}

export type FulfillmentMode = 'delivery' | 'pickup'

export interface PaymentMethod {
  id: string
  name: string
  hint?: string
  /** Exibe campo "troco para". */
  asksChange?: boolean
  active: boolean
}

export interface DayHours {
  /** 0 = domingo … 6 = sábado */
  day: number
  open: string // "HH:MM"
  close: string // "HH:MM"
}

export interface CartAddon {
  addonId: string
  name: string
  price: Money
  quantity: number
}

export interface CartLine {
  /** Chave única: produto + adicionais + observação. */
  key: string
  productId: string
  name: string
  unitPrice: Money
  quantity: number
  addons: CartAddon[]
  note?: string
  image?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  street: string
  number: string
  complement: string
  zoneId: string
  reference: string
  paymentId: string
  changeFor: string
  notes: string
}

export interface OrderTotals {
  subtotal: Money
  deliveryFee: Money
  total: Money
}

export interface Order {
  id: string
  createdAt: string
  mode: FulfillmentMode
  lines: CartLine[]
  customer: CustomerInfo
  totals: OrderTotals
}
