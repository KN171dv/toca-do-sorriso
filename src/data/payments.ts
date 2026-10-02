import type { PaymentMethod } from '@/types'

/** Formas de pagamento reais da loja (pagamento na entrega/retirada). */
export const paymentMethods: PaymentMethod[] = [
  { id: 'pix', name: 'PIX', hint: 'Chave enviada após a confirmação do pedido', active: true },
  { id: 'dinheiro', name: 'Dinheiro', asksChange: true, active: true },
  { id: 'debito', name: 'Cartão de débito', hint: 'Na maquininha', active: true },
  { id: 'credito', name: 'Cartão de crédito', hint: 'Na maquininha', active: true },
]
