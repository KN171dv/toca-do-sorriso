import type { Addon, Category, Product } from '@/types'
import { addons, categories, products } from '@/data'

/**
 * Acesso ao catálogo. A UI só fala com estas funções — quando existir um
 * admin/banco, basta trocar a origem dos dados aqui.
 */
export const getCategories = (): Category[] => categories.filter((c) => c.active).sort((a, b) => a.order - b.order)

export const getProducts = (): Product[] => products.filter((p) => p.active)

export const getProductsByCategory = (categoryId: string): Product[] =>
  getProducts().filter((p) => p.categoryId === categoryId).sort((a, b) => a.order - b.order)

export const getProduct = (id: string): Product | undefined => products.find((p) => p.id === id)

export const getAddonsFor = (product: Product): Addon[] =>
  product.addonIds.map((id) => addons.find((a) => a.id === id)).filter((a): a is Addon => !!a && a.active)
