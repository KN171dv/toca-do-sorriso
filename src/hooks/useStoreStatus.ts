import { useEffect, useState } from 'react'
import { getStoreStatus, summarizeHours, type StoreStatus } from '@/lib/hours'

/** Valor estável para o HTML pré-renderizado; o status real entra após montar. */
const first = summarizeHours()[0]
const STATIC: StoreStatus = { isOpen: false, label: first ? `${first.days} · ${first.time}` : '', todayHours: undefined, pending: true }

/** Status aberto/fechado, reavaliado a cada minuto. */
export function useStoreStatus(): StoreStatus {
  const [status, setStatus] = useState<StoreStatus>(STATIC)
  useEffect(() => {
    setStatus(getStoreStatus())
    const id = window.setInterval(() => setStatus(getStoreStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}
