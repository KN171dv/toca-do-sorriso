import { useCallback, useEffect, useRef, useState } from 'react'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { cartCount } from '@/lib/pricing'
import { cx } from '@/lib/format'
import { ScrollTrigger } from '@/lib/motion'
import { scrollToTarget } from '@/hooks/useLenis'
import { useOverlay } from '@/hooks/useOverlay'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { useCartFeedback } from '@/hooks/useCartFeedback'
import { ArrowIcon, BagIcon, CloseIcon, MenuIcon } from '@/components/ui/Icons'
import { StatusPill } from '@/components/ui/StatusPill'

/** Na ordem em que as seções aparecem na página. */
const NAV = [
  { id: 'inicio', href: '#topo', label: 'Início' },
  { id: 'destaque', href: '#destaque', label: 'Destaque' },
  { id: 'cardapio', href: '#cardapio', label: 'Cardápio' },
  { id: 'sobre', href: '#sobre', label: 'Sobre' },
  { id: 'delivery', href: '#delivery', label: 'Delivery' },
  { id: 'contato', href: '#contato', label: 'Contato' },
] as const
type NavId = (typeof NAV)[number]['id']

/** Seção da página → item do menu que fica ativo enquanto ela está na tela. */
const SPY: [string, NavId][] = [
  ['#topo', 'inicio'], ['#destaque', 'destaque'], ['#mais-pedidos', 'destaque'], ['#cardapio', 'cardapio'],
  ['#sobre', 'sobre'], ['#delivery', 'delivery'], ['#instagram', 'contato'], ['#contato', 'contato'],
]

/**
 * Seção ativa: as posições são lidas só quando o ScrollTrigger recalcula o
 * layout (carga, resize); durante o scroll é só comparação de números.
 */
function useActiveSection(): NavId {
  const [active, setActive] = useState<NavId>('inicio')
  useEffect(() => {
    let tops: [number, NavId][] = []
    const measure = () => {
      tops = SPY.flatMap(([sel, id]) => {
        const el = document.querySelector<HTMLElement>(sel)
        return el ? [[el.getBoundingClientRect().top + window.scrollY, id] as [number, NavId]] : []
      })
    }
    const update = (scroll: number) => {
      const line = scroll + window.innerHeight * 0.4
      let current: NavId = 'inicio'
      for (const [top, id] of tops) if (top <= line) current = id
      setActive(current)
    }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => update(self.scroll()), onRefresh: (self) => update(self.scroll()) })
    update(window.scrollY)
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      st.kill()
    }
  }, [])
  return active
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const count = useCart((s) => cartCount(s.lines))
  const setPanel = useUi((s) => s.setPanel)
  const status = useStoreStatus()
  const active = useActiveSection()
  const pulse = useCartFeedback()
  const panel = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenu(false), [])
  useOverlay(menu, panel, closeMenu)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    if (menu) {
      setMenu(false)
      // espera o menu liberar o scroll da página
      window.setTimeout(() => scrollToTarget(href), 60)
    } else scrollToTarget(href)
  }

  return (
    <>
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
        <a href="#topo" onClick={(e) => go(e, '#topo')} className="flex min-h-11 shrink-0 flex-col justify-center leading-none">
          <span className="display text-[1.35rem] text-cream-50">Toca do <span className="text-ember-500">Sorriso</span></span>
          <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.42em] text-cream-300">na brasa</span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={n.href}
              onClick={(e) => go(e, n.href)}
              aria-current={active === n.id ? 'true' : undefined}
              className={cx(
                'group relative inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-300',
                active === n.id ? 'text-cream-50' : 'text-cream-300 hover:text-cream-50',
              )}
            >
              {n.label}
              <span
                aria-hidden="true"
                className={cx(
                  'absolute inset-x-0 bottom-1.5 h-0.5 origin-left rounded-full bg-ember-500 transition-transform duration-500 ease-out-expo',
                  active === n.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-35',
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden min-[480px]:block"><StatusPill status={status} /></span>
          <span className="hidden min-[375px]:block min-[480px]:hidden"><StatusPill status={status} compact /></span>
          <button
            type="button"
            onClick={() => setPanel('cart')}
            aria-label={count ? `Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}` : 'Abrir carrinho'}
            data-cart-target
            className={cx(
              'relative grid size-11 shrink-0 place-items-center rounded-full border border-cream-100/15 bg-coal-900/60 text-cream-50 transition-[border-color,color,translate,scale] duration-200 hover:border-ember-500 hover:text-ember-400 active:scale-95 sm:size-12',
              pulse && 'animate-[cart-bump_.5s_var(--ease-out-expo)]',
            )}
          >
            <BagIcon />
            {count > 0 && (
              <span key={count} className="absolute -right-0.5 -top-0.5 grid min-w-5 animate-[pop_.35s_var(--ease-out-expo)] place-items-center rounded-full bg-ember-500 px-1 text-[0.7rem] font-bold leading-5 text-coal-950">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-label="Abrir menu"
            aria-expanded={menu}
            aria-controls="menu-mobile"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-cream-100/15 bg-coal-900/60 text-cream-50 transition-[border-color,translate,scale] duration-200 hover:border-ember-500 active:scale-95 sm:size-12 lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>

      {/* Menu mobile: tela cheia, foco preso e Esc via useOverlay. Montado sempre (sem Motion no 1º render). */}
      <div
        ref={panel}
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        inert={!menu}
        data-open={menu || undefined}
        className="group/menu invisible fixed inset-0 z-50 flex flex-col bg-coal-950/97 opacity-0 backdrop-blur-md transition-[opacity,visibility] duration-300 ease-out data-open:visible data-open:opacity-100 lg:hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_50%_at_50%_110%,rgb(224_102_26/0.28),transparent_70%)]" />
        <div className="container-x flex h-16 shrink-0 items-center justify-between">
          <span className="display text-[1.35rem] text-cream-50">Toca do <span className="text-ember-500">Sorriso</span></span>
          <button type="button" onClick={closeMenu} aria-label="Fechar menu" data-autofocus className="grid size-11 place-items-center rounded-full border border-cream-100/15 text-cream-50 transition-colors hover:border-ember-500 sm:size-12">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Seções" className="container-x flex flex-1 flex-col justify-center overflow-y-auto py-6">
          <ul>
            {NAV.map((n, i) => (
              <li
                key={n.id}
                className="translate-y-3 opacity-0 transition-[opacity,translate,scale] duration-500 ease-out-expo group-data-open/menu:translate-y-0 group-data-open/menu:opacity-100"
                style={{ transitionDelay: menu ? `${60 + i * 45}ms` : '0ms' }}
              >
                <a
                  href={n.href}
                  onClick={(e) => go(e, n.href)}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={cx(
                    'flex min-h-14 items-center gap-4 border-b border-cream-100/8 py-2 transition-colors',
                    active === n.id ? 'text-ember-500' : 'text-cream-50 hover:text-ember-400',
                  )}
                >
                  <span className="w-6 text-xs font-bold tabular-nums tracking-[0.2em] text-cream-500">0{i + 1}</span>
                  <span className="display text-[clamp(2rem,9vw,2.8rem)]">{n.label}</span>
                  {active === n.id && <span className="ml-auto size-2 rounded-full bg-ember-500" aria-hidden="true" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x flex shrink-0 flex-wrap items-center justify-between gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          <StatusPill status={status} />
          <a href="#cardapio" onClick={(e) => go(e, '#cardapio')} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ember-500 px-6 text-[0.86rem] font-bold uppercase tracking-[0.08em] text-coal-950 shadow-ember transition-[translate,scale,background-color] duration-200 hover:bg-ember-400 active:scale-[0.97]">
            Pedir agora <ArrowIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </>
  )
}
