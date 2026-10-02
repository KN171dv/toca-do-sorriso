import type { Product } from '@/types'
import { flyToCart } from '@/lib/flyToCart'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'

/**
 * Botão "+" do cardápio: itens simples entram direto no carrinho (1 toque);
 * itens com adicionais abrem o modal para personalizar.
 * Retorna `true` quando o item foi adicionado direto (para o botão confirmar).
 */
export function useAddProduct() {
  const add = useCart((s) => s.add)
  const openProduct = useUi((s) => s.openProduct)
  return (product: Product, from?: Element | null): boolean => {
    if (product.addonIds.length) {
      openProduct(product.id)
      return false
    }
    add(product, 1, [])
    flyToCart(from ?? null, product.image?.srcSmall ?? product.image?.src)
    return true
  }
}
