import type { Category } from '@/types'

/**
 * Categorias reais do InstaDelivery. As duas categorias "Porções" do site
 * original foram unificadas. "Sobremesas" e "Sorvete carioca 250g" existem
 * na loja mas estão sem itens → ficam cadastradas e inativas.
 */
export const categories: Category[] = [
  { id: 'hamburgueres', name: 'Hambúrgueres', image: '/images/categories/hamburguer.webp', order: 1, active: true },
  { id: 'combos', name: 'Combos', image: '/images/categories/combos.webp', order: 2, active: true },
  { id: 'prato-feito', name: 'Prato feito', image: '/images/categories/prato-feito.webp', order: 3, active: true },
  { id: 'porcoes', name: 'Porções', image: '/images/categories/porcoes.webp', order: 4, active: true },
  { id: 'bebidas', name: 'Bebidas', order: 5, active: true },
  { id: 'sobremesas', name: 'Sobremesas', order: 6, active: false },
  { id: 'sorvete-carioca', name: 'Sorvete carioca 250g', order: 7, active: false },
]
