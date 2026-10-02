import type { CartLine, FulfillmentMode, OrderTotals } from '@/types'
import { deliveryConfig, deliveryZones } from '@/data/delivery'

const round = (n: number) => Math.round(n * 100) / 100

export const lineUnitTotal = (line: Pick<CartLine, 'unitPrice' | 'addons'>): number =>
  round(line.unitPrice + line.addons.reduce((sum, a) => sum + a.price * a.quantity, 0))

export const lineTotal = (line: CartLine): number => round(lineUnitTotal(line) * line.quantity)

export const cartSubtotal = (lines: CartLine[]): number => round(lines.reduce((sum, l) => sum + lineTotal(l), 0))

export const cartCount = (lines: CartLine[]): number => lines.reduce((sum, l) => sum + l.quantity, 0)

/** Taxa de entrega: null enquanto o bairro não foi escolhido. */
export function deliveryFeeFor(mode: FulfillmentMode, zoneId: string | undefined): number | null {
  if (mode === 'pickup') return 0
  const zone = deliveryZones.find((z) => z.id === zoneId)
  return zone ? zone.fee : null
}

export function computeTotals(lines: CartLine[], mode: FulfillmentMode, zoneId?: string): OrderTotals {
  const subtotal = cartSubtotal(lines)
  const deliveryFee = deliveryFeeFor(mode, zoneId) ?? 0
  return { subtotal, deliveryFee, total: round(subtotal + deliveryFee) }
}

export const missingForMinimum = (subtotal: number): number => Math.max(0, round(deliveryConfig.minimumOrder - subtotal))
