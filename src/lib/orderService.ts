import type { Order } from '@/types'
import { buildOrderMessage, whatsappUrl } from './whatsapp'

/**
 * Camada de envio de pedidos.
 *
 * Hoje: o pedido é montado no site e enviado ao WhatsApp da loja — funciona
 * sem backend. Para ter painel de pedidos/admin, implemente outro
 * `OrderGateway` (ex.: Supabase/API própria) e troque em `orderGateway`.
 * Veja docs/ARCHITECTURE.md.
 */
export interface OrderGateway {
  submit(order: Order): Promise<{ ok: true; redirectUrl?: string } | { ok: false; error: string }>
}

const whatsappGateway: OrderGateway = {
  async submit(order) {
    return { ok: true, redirectUrl: whatsappUrl(buildOrderMessage(order)) }
  },
}

export const orderGateway: OrderGateway = whatsappGateway

export const newOrderId = (): string => `#${Date.now().toString(36).slice(-5).toUpperCase()}`
