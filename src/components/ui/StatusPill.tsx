import type { StoreStatus } from '@/lib/hours'
import { cx } from '@/lib/format'

export function StatusPill({ status, className }: { status: StoreStatus; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 rounded-full border border-cream-100/15 bg-coal-900/60 px-3 py-1.5 text-xs font-semibold text-cream-100', className)}>
      <span className={cx('size-2 rounded-full', status.isOpen ? 'animate-pulse-dot bg-ok' : 'bg-cream-500')} aria-hidden="true" />
      {status.label}
    </span>
  )
}
