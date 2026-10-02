import type { CustomerInfo, FulfillmentMode } from '@/types'
import { paymentMethods } from '@/data/payments'

export type CheckoutErrors = Partial<Record<keyof CustomerInfo, string>>

const parseMoney = (v: string): number => Number(v.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'))

export function validateCheckout(c: CustomerInfo, mode: FulfillmentMode, total: number): CheckoutErrors {
  const e: CheckoutErrors = {}
  if (c.name.trim().length < 2) e.name = 'Informe seu nome.'
  const digits = c.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 11) e.phone = 'Informe um telefone com DDD.'
  if (mode === 'delivery') {
    if (c.street.trim().length < 3) e.street = 'Informe o endereço.'
    if (!c.number.trim()) e.number = 'Informe o número.'
    if (!c.zoneId) e.zoneId = 'Selecione o bairro.'
  }
  const payment = paymentMethods.find((p) => p.id === c.paymentId)
  if (!payment) e.paymentId = 'Escolha a forma de pagamento.'
  if (payment?.asksChange && c.changeFor.trim()) {
    const value = parseMoney(c.changeFor)
    if (Number.isNaN(value) || value < total) e.changeFor = 'O valor do troco deve ser maior que o total.'
  }
  return e
}
