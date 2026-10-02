import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'

/** `true` por ~0,5 s a cada item adicionado (pulso no ícone do carrinho). */
export function useCartFeedback(): boolean {
  const at = useCart((s) => s.lastAdded?.at)
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!at) return
    setPulse(true)
    const id = window.setTimeout(() => setPulse(false), 520)
    return () => window.clearTimeout(id)
  }, [at])
  return pulse
}
