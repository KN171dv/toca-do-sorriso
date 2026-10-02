import type { StoreStatus } from '@/lib/hours'
import { cx } from '@/lib/format'

/** `compact`: só "Aberto"/"Fechado" (cabeçalho em telas estreitas); o texto completo vai para leitores de tela. */
export function StatusPill({ status, className, compact }: { status: StoreStatus; className?: string; compact?: boolean }) {
  const short = status.pending ? null : status.isOpen ? 'Aberto' : 'Fechado'
  return (
    <span className={cx('inline-flex items-center gap-2 rounded-full border border-cream-100/15 bg-coal-900/60 py-1.5 text-xs font-semibold text-cream-100', compact ? 'px-2.5' : 'px-3', className)}>
      <span className={cx('size-2 shrink-0 rounded-full', status.isOpen ? 'animate-pulse-dot bg-ok' : 'bg-cream-500')} aria-hidden="true" />
      {!compact ? status.label : short ? (
        <><span aria-hidden="true">{short}</span><span className="sr-only">{status.label}</span></>
      ) : (
        <span className="invisible" aria-hidden="true">Fechado</span> /* reserva espaço até o status real (HTML estático) */
      )}
    </span>
  )
}
