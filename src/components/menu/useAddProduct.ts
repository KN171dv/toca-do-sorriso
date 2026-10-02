import type { Product } from '@/types'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'

/**
 * Botão "+" do cardápio: itens simples entram direto no carrinho (1 toque);
 * itens com adicionais abrem o modal para personalizar.
 */
export function useAddProduct() {
  const add = useCart((s) => s.add)
  const openProduct = useUi((s) => s.openProduct)
  return (product: Product) => {
    if (product.addonIds.length) openProduct(product.id)
    else add(product, 1, [])
  }
}
