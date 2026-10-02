import type { ProductBadge } from '@/types'
import { cx } from '@/lib/format'

const LABEL: Record<ProductBadge, string> = {
  'mais-pedido': 'Mais pedido',
  'mais-vendido': '+ Vendido',
  novidade: 'Novidade',
}

export function Badges({ badges, className }: { badges: ProductBadge[]; className?: string }) {
  if (!badges.length) return null
  return (
    <span className={cx('flex flex-wrap gap-1.5', className)}>
      {badges.map((b) => (
        <span key={b} className={cx('rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em]', b === 'novidade' ? 'bg-cream-50 text-coal-950' : 'bg-ember-500 text-coal-950')}>
          {LABEL[b]}
        </span>
      ))}
    </span>
  )
}
