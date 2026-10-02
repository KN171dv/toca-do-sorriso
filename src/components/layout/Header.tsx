import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { cartCount } from '@/lib/pricing'
import { cx } from '@/lib/format'
import { scrollToTarget } from '@/hooks/useLenis'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { BagIcon } from '@/components/ui/Icons'
import { StatusPill } from '@/components/ui/StatusPill'

const NAV = [
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const [solid, setSolid] = useState(false)
  const count = useCart((s) => cartCount(s.lines))
  const setPanel = useUi((s) => s.setPanel)
  const status = useStoreStatus()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300',
        solid ? 'border-b border-cream-100/10 bg-coal-950/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <a href="#cardapio" onClick={(e) => go(e, '#cardapio')} className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ember-500 focus:px-4 focus:py-2 focus:font-bold focus:text-coal-950">
        Pular para o cardápio
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <a href="#topo" onClick={(e) => go(e, '#topo')} className="flex min-h-11 flex-col justify-center leading-none">
          <span className="display text-[1.35rem] text-cream-50">Toca do <span className="text-ember-500">Sorriso</span></span>
          <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.42em] text-cream-300">na brasa</span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] text-cream-300 transition-colors hover:text-cream-50">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <StatusPill status={status} className="max-[359px]:hidden" />
          <button
            type="button"
            onClick={() => setPanel('cart')}
            aria-label={count ? `Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}` : 'Abrir carrinho'}
            className="relative grid size-12 place-items-center rounded-full border border-cream-100/15 bg-coal-900/60 text-cream-50 transition-colors hover:border-ember-500 hover:text-ember-400"
          >
            <BagIcon />
            {count > 0 && (
              <span key={count} className="absolute -right-0.5 -top-0.5 grid min-w-5 animate-[pop_.35s_var(--ease-out-expo)] place-items-center rounded-full bg-ember-500 px-1 text-[0.7rem] font-bold leading-5 text-coal-950">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
