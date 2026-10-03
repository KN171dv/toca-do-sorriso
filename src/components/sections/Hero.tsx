import { useEffect, useRef } from 'react'
import { deliveryConfig } from '@/data/delivery'
import { featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import { gsap } from '@/lib/motion'
import { scrollToTarget } from '@/hooks/useLenis'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { Embers } from '@/components/ui/Embers'
import { Money } from '@/components/ui/Money'
import { HERO_3D } from '@/data/burger3d'
import { ArrowIcon } from '@/components/ui/Icons'
import { StatusPill } from '@/components/ui/StatusPill'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const is3d = featured.heroVariant === '3d'
  const product = getProduct(is3d ? featured.explodedProductId : featured.heroProductId)!
  const openProduct = useUi((s) => s.openProduct)
  const status = useStoreStatus()

  useEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Saída (scrub): só deslocamento e opacidade, sem escala
      gsap.to('[data-hero-photo-wrap]', {
        yPercent: 12, opacity: 0.55, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-copy]', {
        yPercent: -8, opacity: 0.25, ease: 'none',
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
        {/* Imagem — no mobile vem primeiro: comida é a protagonista. Nunca maior que o arquivo
            (foto: 500px), sempre nítida (sem máscara nem degradê sobre o lanche). A brasa do fundo
            passa por trás e a sombra é quente, para ela parecer iluminada, não um card colado. */}
        <div data-hero-photo-wrap className="relative order-1 mx-auto mb-9 mt-1 w-[min(88vw,38svh,500px)] shrink-0 max-lg:[@media(max-height:620px)]:mb-0 max-lg:[@media(max-height:620px)]:w-[min(88vw,32svh)] will-change-transform lg:order-2 lg:mb-0 lg:mt-0 lg:w-[min(40vw,64svh,500px)]">
          <div aria-hidden="true" className="absolute -inset-[34%] rounded-full bg-[radial-gradient(closest-side,rgb(245_138_42/0.42),rgb(184_72_15/0.18)_55%,transparent)]" />
          <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[-6%] top-[30%] rounded-full bg-ember-600/45 blur-[70px]" />
          {is3d ? (
            <img
              src={HERO_3D.src}
              srcSet={`${HERO_3D.srcSmall} ${HERO_3D.widthSmall}w, ${HERO_3D.src} ${HERO_3D.width}w`}
              sizes="(min-width: 1024px) 500px, min(88vw, 38svh, 500px)"
              alt={HERO_3D.alt}
              width={HERO_3D.width} height={HERO_3D.height}
              fetchPriority="high"
              decoding="async"
              className="hero-photo relative w-full drop-shadow-[0_34px_40px_rgb(40_12_2/0.75)]"
            />
          ) : (
            <img
              src={product.image!.src}
              alt={product.image!.alt}
              width={500} height={500}
              fetchPriority="high"
              decoding="async"
              className="hero-photo relative aspect-square w-full rounded-[1.75rem] object-cover shadow-[0_40px_90px_-30px_rgb(70_22_4/0.95),0_0_0_1px_rgb(246_231_206/0.05),0_0_60px_-10px_rgb(224_102_26/0.35)] lg:rounded-[2.25rem]"
            />
          )}
          {/* Pílula clicável: abre o produto. No celular fica quase toda abaixo da foto (não cobre o lanche). */}
          <button
            type="button"
            onClick={() => openProduct(product.id)}
            style={{ ['--i' as string]: 0 }}
            className="hero-fade group absolute -bottom-10 right-1 flex items-center gap-3 whitespace-nowrap rounded-full border border-cream-100/12 bg-coal-950/75 py-1.5 pl-4 pr-1.5 text-left shadow-[inset_0_1px_0_rgb(246_231_206/0.08),0_14px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-ember-500/60 max-lg:[@media(max-height:620px)]:hidden lg:-bottom-6 lg:right-[-3%]"
          >
            <span className="leading-tight">
              <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream-500">{is3d ? 'Imagem ilustrativa' : 'Na foto'}</span>
              <span className="block text-sm font-bold text-cream-50">{product.name} · <Money value={product.price} /></span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-ember-500 text-coal-950 transition-transform duration-300 group-hover:translate-x-0.5"><ArrowIcon width={16} height={16} /></span>
          </button>
        </div>

        <div data-hero-copy className="order-2 flex flex-1 flex-col justify-end pb-8 pt-4 lg:order-1 lg:justify-center lg:pb-0 lg:pt-0">
          <p  style={{ ['--i' as string]: 1 }} className="hero-fade eyebrow mb-4">Hambúrguer artesanal · Mendanha, RJ</p>
          <h1 className="display text-[clamp(2.6rem,min(15.5vw,10svh),8.2rem)] max-[359px]:text-[min(13.5vw,10svh)] text-cream-50 lg:text-[clamp(4.25rem,min(7.2vw,13svh),7rem)]">
            <span className="block overflow-hidden pt-[0.08em]"><span className="hero-line block">O sorriso</span></span>
            <span className="block overflow-hidden pt-[0.08em]"><span className="hero-line block" style={{ ['--i' as string]: 1 }}>vem da <span className="text-ember-500">brasa.</span></span></span>
          </h1>
          <p  style={{ ['--i' as string]: 2 }} className="hero-fade mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-cream-300 max-lg:[@media(max-height:700px)]:hidden lg:text-lg">
            Pão brioche tostado na manteiga, carne de 100g, cheddar e maionese temperada.
            Peça direto pelo site — entrega ou retirada.
          </p>

          <div  style={{ ['--i' as string]: 3 }} className="hero-fade mt-7 flex gap-2.5 sm:gap-3">
            <Button size="lg" className="whitespace-nowrap max-sm:flex-1 max-sm:!px-4 max-[359px]:!px-3 max-[359px]:!text-[0.8rem] max-[359px]:!tracking-[0.04em]" onClick={() => scrollToTarget('#cardapio')}>Pedir agora <ArrowIcon /></Button>
            <Button size="lg" variant="outline" className="whitespace-nowrap max-sm:flex-1 max-sm:!px-4 max-[359px]:!px-3 max-[359px]:!text-[0.8rem] max-[359px]:!tracking-[0.04em]" onClick={() => scrollToTarget('#destaque')}>Ver por dentro</Button>
          </div>

          <ul  style={{ ['--i' as string]: 4 }} className="hero-fade mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream-300">
            <li><StatusPill status={status} /></li>
            <li>Pedido mínimo <Money value={deliveryConfig.minimumOrder} /></li>
            <li className="hidden min-[420px]:block">Entrega · Retirada</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
