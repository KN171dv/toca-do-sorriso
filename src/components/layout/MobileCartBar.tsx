import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { cartCount, cartSubtotal } from '@/lib/pricing'
import { cx, formatMoney } from '@/lib/format'
import { BagIcon } from '@/components/ui/Icons'

/** Barra fixa inferior: carrinho sempre a um toque quando há itens. */
export function MobileCartBar() {
  const lines = useCart((s) => s.lines)
  const { panel, productId, setPanel } = useUi()
  const count = cartCount(lines)
  const visible = count > 0 && panel === 'none' && !productId

  return (
    <div
      aria-hidden={!visible}
      className={cx(
        'transition-[transform,opacity,visibility] duration-400 ease-out-expo',
        visible ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-24 opacity-0',
        'fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:inset-x-auto md:right-6 md:w-[380px] md:px-0 md:pb-6',
      )}
    >
          <button
            type="button"
            tabIndex={visible ? 0 : -1}
            onClick={() => setPanel('cart')}
            className="flex min-h-[60px] w-full items-center justify-between gap-3 rounded-full bg-ember-500 pl-3 pr-6 text-coal-950 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.8)] transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="relative grid size-11 place-items-center rounded-full bg-coal-950 text-ember-400">
                <BagIcon />
                <span key={count} className="absolute -right-1 -top-1 grid min-w-5 animate-[pop_.35s_var(--ease-out-expo)] place-items-center rounded-full bg-cream-50 px-1 text-[0.7rem] font-bold leading-5 text-coal-950">{count}</span>
              </span>
              <span className="text-[0.9rem] font-bold uppercase tracking-[0.1em]">Ver carrinho</span>
            </span>
            <span className="text-lg font-bold tabular-nums">{formatMoney(cartSubtotal(lines))}</span>
          </button>
    </div>
  )
}
