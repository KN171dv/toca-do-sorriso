import { useEffect, useRef } from 'react'
import { deliveryConfig } from '@/data/delivery'
import { featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import { formatMoney } from '@/lib/format'
import { gsap } from '@/lib/motion'
import { scrollToTarget } from '@/hooks/useLenis'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { Embers } from '@/components/ui/Embers'
import { ArrowIcon } from '@/components/ui/Icons'
import { StatusPill } from '@/components/ui/StatusPill'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const product = getProduct(featured.heroProductId)!
  const openProduct = useUi((s) => s.openProduct)
  const status = useStoreStatus()

  useEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Parallax de saída (scrub)
      gsap.to('[data-hero-photo-wrap]', {
        yPercent: 14, scale: 0.94, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-copy]', {
        yPercent: -8, autoAlpha: 0.25, ease: 'none',
        scrollTrigger: { trigger: root.current, start: '35% top', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="topo" className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16 lg:min-h-[max(100svh,720px)]">
      {/* Atmosfera: calor vindo de baixo + fumaça sutil */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_70%_100%,rgb(224_102_26/0.32),transparent_60%),radial-gradient(60%_50%_at_20%_10%,rgb(245_138_42/0.08),transparent_70%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[8%] -z-10 size-[80vmin] -translate-x-1/2 animate-smoke rounded-full bg-[radial-gradient(closest-side,rgb(246_231_206/0.07),transparent)] blur-2xl lg:left-[68%]" />
      <Embers />

      <div className="container-x relative flex flex-1 flex-col lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6">
        {/* Foto — no mobile vem primeiro: comida é a protagonista */}
        <div data-hero-photo-wrap className="relative order-1 mx-auto mt-1 w-[min(92vw,46svh,460px)] shrink-0 will-change-transform lg:order-2 lg:mt-0 lg:w-[min(46vw,78svh,640px)]">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-ember-600/40 blur-[70px]" />
          <img
            src={product.image!.src}
            alt={product.image!.alt}
            width={640} height={640}
            fetchPriority="high"
            decoding="async"
            className="hero-photo relative aspect-square w-full object-cover [mask-image:radial-gradient(closest-side,#000_50%,transparent_98%)]"
          />
          <button
            type="button"
            
            onClick={() => openProduct(product.id)}
            style={{ ['--i' as string]: 0 }} className="hero-fade absolute bottom-[9%] right-0 flex items-center gap-3 rounded-full border border-cream-100/15 bg-coal-950/80 py-2 pl-4 pr-2 text-left backdrop-blur-md transition-colors hover:border-ember-500 lg:right-[4%]"
          >
            <span className="leading-tight">
              <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-cream-500">Na foto</span>
              <span className="block text-sm font-bold text-cream-50">{product.name} · {formatMoney(product.price)}</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-ember-500 text-coal-950"><ArrowIcon width={16} height={16} /></span>
          </button>
        </div>

        <div data-hero-copy className="order-2 flex flex-1 flex-col justify-end pb-8 pt-4 lg:order-1 lg:justify-center lg:pb-0 lg:pt-0">
          <p  style={{ ['--i' as string]: 1 }} className="hero-fade eyebrow mb-4">Hambúrguer artesanal · Mendanha, RJ</p>
          <h1 className="display text-[clamp(3.1rem,15.5vw,8.2rem)] text-cream-50 lg:text-[clamp(4.5rem,7.6vw,7.25rem)]">
            <span className="block overflow-hidden pt-[0.08em]"><span className="hero-line block">O sorriso</span></span>
            <span className="block overflow-hidden pt-[0.08em]"><span className="hero-line block" style={{ ['--i' as string]: 1 }}>vem da <span className="text-ember-500">brasa.</span></span></span>
          </h1>
          <p  style={{ ['--i' as string]: 2 }} className="hero-fade mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-cream-300 lg:text-lg">
            Pão brioche tostado na manteiga, carne de 100g, cheddar e maionese temperada.
            Peça direto pelo site — entrega ou retirada.
          </p>

          <div  style={{ ['--i' as string]: 3 }} className="hero-fade mt-7 flex gap-2.5 sm:gap-3">
            <Button size="lg" className="max-sm:flex-1 max-sm:!px-4" onClick={() => scrollToTarget('#cardapio')}>Pedir agora <ArrowIcon /></Button>
            <Button size="lg" variant="outline" className="max-sm:flex-1 max-sm:!px-4" onClick={() => scrollToTarget('#destaque')}>Ver por dentro</Button>
          </div>

          <ul  style={{ ['--i' as string]: 4 }} className="hero-fade mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream-300">
            <li><StatusPill status={status} /></li>
            <li>Pedido mínimo {formatMoney(deliveryConfig.minimumOrder)}</li>
            <li className="hidden min-[420px]:block">Entrega · Retirada</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
