import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CustomerInfo, FulfillmentMode } from '@/types'

type Panel = 'none' | 'cart' | 'checkout' | 'success'

interface UiState {
  panel: Panel
  productId: string | null
  openProduct: (id: string) => void
  closeProduct: () => void
  setPanel: (panel: Panel) => void
}

export const useUi = create<UiState>((set) => ({
  panel: 'none',
  productId: null,
  openProduct: (id) => set({ productId: id }),
  closeProduct: () => set({ productId: null }),
  setPanel: (panel) => set({ panel }),
}))

const emptyCustomer: CustomerInfo = {
  name: '', phone: '', street: '', number: '', complement: '', zoneId: '',
  reference: '', paymentId: '', changeFor: '', notes: '',
}

interface CheckoutState {
  mode: FulfillmentMode
  customer: CustomerInfo
  setMode: (mode: FulfillmentMode) => void
  update: (patch: Partial<CustomerInfo>) => void
}

/** Dados do cliente ficam salvos no aparelho para o próximo pedido ser mais rápido. */
export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      mode: 'delivery',
      customer: emptyCustomer,
      setMode: (mode) => set({ mode }),
      update: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
    }),
    { name: 'toca-checkout-v1', skipHydration: true },
  ),
)
