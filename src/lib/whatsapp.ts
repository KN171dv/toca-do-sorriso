import type { Order } from '@/types'
import { businessInfo } from '@/data/business'
import { deliveryZones } from '@/data/delivery'
import { paymentMethods } from '@/data/payments'
import { formatMoney } from './format'
import { lineTotal } from './pricing'

/** Monta a mensagem do pedido em texto puro (formatação do WhatsApp). */
export function buildOrderMessage(order: Order): string {
  const { customer: c, totals, mode, lines } = order
  const zone = deliveryZones.find((z) => z.id === c.zoneId)
  const payment = paymentMethods.find((p) => p.id === c.paymentId)
  const out: string[] = []

  out.push(`*Novo pedido — ${businessInfo.name}*`, `Pedido ${order.id}`, '')
  for (const line of lines) {
    out.push(`*${line.quantity}x ${line.name}* — ${formatMoney(lineTotal(line))}`)
    for (const a of line.addons) out.push(`   + ${a.quantity}x ${a.name} (${formatMoney(a.price * a.quantity)})`)
    if (line.note) out.push(`   Obs.: ${line.note}`)
  }
  out.push('', `Subtotal: ${formatMoney(totals.subtotal)}`)
  if (mode === 'delivery') out.push(`Entrega (${zone?.name ?? '—'}): ${formatMoney(totals.deliveryFee)}`)
  out.push(`*Total: ${formatMoney(totals.total)}*`, '')

  out.push(mode === 'delivery' ? '*Entrega*' : '*Retirada no local*')
  out.push(`Nome: ${c.name.trim()}`, `Telefone: ${c.phone}`)
  if (mode === 'delivery') {
    out.push(`Endereço: ${c.street.trim()}, ${c.number.trim()}${c.complement.trim() ? ` — ${c.complement.trim()}` : ''}`)
    out.push(`Bairro: ${zone?.name ?? '—'}`)
    if (c.reference.trim()) out.push(`Referência: ${c.reference.trim()}`)
  }
  out.push('', `Pagamento: ${payment?.name ?? '—'}`)
  if (payment?.asksChange) out.push(c.changeFor.trim() ? `Troco para: ${c.changeFor.trim()}` : 'Não precisa de troco')
  if (c.notes.trim()) out.push('', `Observações: ${c.notes.trim()}`)
  return out.join('\n')
}

export const whatsappUrl = (message: string): string =>
  `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(message)}`

export const whatsappContactUrl = (): string => `https://wa.me/${businessInfo.whatsapp}`
