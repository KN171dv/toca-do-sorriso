import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'

/** Região aria-live: anuncia cada item adicionado ao carrinho. */
export function CartAnnouncer() {
  const last = useCart((s) => s.lastAdded)
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!last) return
    // limpa antes para o mesmo texto ser anunciado de novo
    setMessage('')
    const id = window.setTimeout(() => setMessage(`Item adicionado: ${last.quantity > 1 ? `${last.quantity} × ` : ''}${last.name}.`), 60)
    return () => window.clearTimeout(id)
  }, [last])
  return <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{message}</div>
}
