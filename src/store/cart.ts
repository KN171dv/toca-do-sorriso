import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartAddon, CartLine, Product } from '@/types'

/** Último item adicionado — alimenta o feedback visual e o aviso para leitores de tela. Não é persistido. */
export interface CartAddEvent { name: string; quantity: number; at: number }

interface CartState {
  lines: CartLine[]
  lastAdded: CartAddEvent | null
  add: (product: Product, quantity: number, addons: CartAddon[], note?: string) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const lineKey = (productId: string, addons: CartAddon[], note?: string): string =>
  [productId, ...addons.map((a) => `${a.addonId}x${a.quantity}`).sort(), (note ?? '').trim().toLowerCase()].join('|')

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastAdded: null,
      add: (product, quantity, addons, note) =>
        set((state) => {
          const lastAdded = { name: product.name, quantity, at: Date.now() }
          const cleanNote = note?.trim() || undefined
          const key = lineKey(product.id, addons, cleanNote)
          const existing = state.lines.find((l) => l.key === key)
          if (existing) {
            return { lastAdded, lines: state.lines.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l)) }
          }
          const line: CartLine = {
            key, productId: product.id, name: product.name, unitPrice: product.price,
            quantity, addons, note: cleanNote, image: product.image?.srcSmall ?? product.image?.src,
          }
          return { lastAdded, lines: [...state.lines, line] }
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: quantity <= 0 ? state.lines.filter((l) => l.key !== key) : state.lines.map((l) => (l.key === key ? { ...l, quantity } : l)),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'toca-cart-v1', skipHydration: true, partialize: (s) => ({ lines: s.lines }) },
  ),
)
