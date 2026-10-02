import { useEffect, useRef, useState } from 'react'
import { explodedLayers, featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import { cx, formatMoney } from '@/lib/format'
import { gsap } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@/components/ui/Icons'

const N = explodedLayers.length
/** Altura do hambúrguer montado, em % da largura do palco. */
const ASSEMBLED = Math.max(...explodedLayers.map((l) => l.y + l.ratio * 100))

/**
 * Apresentação "exploded view" do hambúrguer em destaque.
 *
 * A seção é alta e o conteúdo fica `position: sticky`; um único ScrollTrigger
 * com scrub conduz a timeline (somente transform/opacity → 60fps).
 *  · Desktop (≥1024px): rótulos ao lado de cada camada, com linha-guia.
 *  · Mobile/tablet: uma camada em foco por vez + legenda única embaixo.
 *  · prefers-reduced-motion: sem coreografia; hambúrguer montado + lista.
 */
export function BurgerExploded() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState(-1)
  const reduce = usePrefersReducedMotion()
  const product = getProduct(featured.explodedProductId)!
  const openProduct = useUi((s) => s.openProduct)

  useEffect(() => {
    if (reduce) return
    const mm = gsap.matchMedia(section)
    mm.add({ desktop: '(min-width: 1024px)', compact: '(max-width: 1023.98px)' }, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean }
      const layers = gsap.utils.toArray<HTMLElement>('[data-layer]')
      const arts = gsap.utils.toArray<HTMLElement>('[data-layer-art]')
      const labels = gsap.utils.toArray<HTMLElement>('[data-layer-label]')
      let current = -1

      // Espaçamento calculado a partir do espaço vertical realmente disponível.
      const gap = () => {
        const el = stage.current!
        const w = el.offsetWidth
        const available = el.parentElement!.offsetHeight
        return gsap.utils.clamp(w * 0.06, w * 0.2, (available - (w * ASSEMBLED) / 100) / (N - 1))
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: desktop ? 0.6 : 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            const next = p > 0.36 && p < 0.78 ? Math.min(N - 1, Math.floor(((p - 0.36) / 0.42) * N)) : -1
            if (next !== current) { current = next; setFocus(next) }
          },
        },
      })

      tl.to({}, { duration: 8 }) // respiro: hambúrguer montado
        .to(layers, { y: (i) => (i - (N - 1) / 2) * gap(), duration: 26, stagger: { each: 0.9, from: 'center' } }, 8)
        .to(arts, { rotation: (i) => (i % 2 ? 1.8 : -1.8), duration: 26, stagger: { each: 0.9, from: 'center' } }, 8)
        .to('[data-stage-glow]', { scale: 1.35, opacity: 0.9, duration: 26 }, 8)
        .to('[data-stage-shadow]', { scaleX: 0.7, opacity: 0.35, duration: 26 }, 8)
        .to('[data-intro]', { autoAlpha: 0, y: -16, duration: 10 }, 8)
      if (desktop) tl.fromTo(labels, { autoAlpha: 0, x: (i) => (i % 2 ? 24 : -24) }, { autoAlpha: 1, x: 0, duration: 10, stagger: 1.2, ease: 'power2.out' }, 20)
      else tl.fromTo('[data-caption]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 6 }, 30)

      tl.to({}, { duration: 42 }, 36) // varredura de foco (controlada por onUpdate)
      tl.to(layers, { y: 0, duration: 16, stagger: { each: 0.5, from: 'edges' } }, 80)
        .to(arts, { rotation: 0, duration: 16 }, 80)
        .to('[data-stage-glow]', { scale: 1, opacity: 0.6, duration: 16 }, 80)
        .to('[data-stage-shadow]', { scaleX: 1, opacity: 0.7, duration: 16 }, 80)
      if (desktop) tl.to(labels, { autoAlpha: 0, duration: 6 }, 78)
      else tl.to('[data-caption]', { autoAlpha: 0, duration: 5 }, 78)
      tl.fromTo('[data-outro]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 8 }, 90)
        .to({}, { duration: 2 })
    })
    return () => mm.revert()
  }, [reduce])

  const focused = focus >= 0 ? explodedLayers[focus] : null

  return (
    <section
      ref={section}
      id="destaque"
      aria-labelledby="destaque-titulo"
      className={cx('relative bg-coal-950', reduce ? 'py-20' : 'h-[280svh] lg:h-[340svh]')}
    >
      <div className={cx('grain isolate overflow-hidden', reduce ? 'relative' : 'sticky top-0 h-[100svh]')}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_58%,rgb(184_72_15/0.28),transparent_70%)] lg:bg-[radial-gradient(50%_60%_at_64%_55%,rgb(184_72_15/0.28),transparent_70%)]" />

        <div className="container-x flex h-full flex-col pb-5 pt-[76px] lg:grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-10 lg:pb-10">
          {/* Texto + CTA (no desktop fica sempre visível: conversão primeiro) */}
          <div className="relative z-10 shrink-0">
            <p className="eyebrow mb-2 lg:mb-4">Destaque da casa</p>
            <h2 id="destaque-titulo" className="display text-[clamp(2.1rem,9.5vw,3.2rem)] text-cream-50 lg:text-[clamp(3rem,5vw,5.2rem)]">
              {product.name},<br className="hidden lg:block" /> <span className="text-ember-500">camada por camada.</span>
            </h2>
            <p className="mt-4 hidden max-w-md text-lg leading-relaxed text-cream-300 lg:block">{product.description}</p>
            <div className="mt-8 hidden items-center gap-5 lg:flex">
              <Button size="lg" onClick={() => openProduct(product.id)}><PlusIcon /> Adicionar</Button>
              <span className="display text-4xl text-cream-50">{formatMoney(product.price)}</span>
            </div>
            <p className="mt-6 hidden text-xs uppercase tracking-[0.18em] text-cream-500 lg:block">Ilustração das camadas · role para desmontar</p>
          </div>

          {/* Palco */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center lg:h-[min(78svh,760px)] lg:flex-none">
            <div ref={stage} className="relative aspect-square w-[min(58vw,30svh,300px)] lg:w-[min(26vw,36svh,380px)]" style={{ marginBottom: `${ASSEMBLED - 100}%` }}>
              <div data-stage-glow aria-hidden="true" className="absolute inset-[-25%] rounded-full bg-[radial-gradient(closest-side,rgb(245_138_42/0.35),transparent)] opacity-60" />
              <div data-stage-shadow aria-hidden="true" className="absolute left-[8%] right-[8%] h-[10%] rounded-[50%] bg-black opacity-70 blur-xl" style={{ top: `${ASSEMBLED - 5}%` }} />
              {explodedLayers.map((layer, i) => {
                const side = i % 2 ? 'right' : 'left'
                const dim = focus >= 0 && focus !== i
                return (
                  <div
                    key={layer.id}
                    data-layer
                    className="absolute left-0 w-full will-change-transform"
                    style={{ top: `${layer.y}%`, zIndex: N - i }}
                  >
                    <img
                      data-layer-art src={layer.image} alt="" aria-hidden="true" draggable={false}
                      width={800} height={Math.round(800 * layer.ratio)}
                      decoding="async" fetchPriority="low"
                      className={cx('block w-full transition-[opacity,filter] duration-300', dim ? 'opacity-40 lg:opacity-60' : 'opacity-100', focus === i && 'drop-shadow-[0_0_22px_rgb(245_138_42/0.55)]')}
                    />
                    {/* Rótulo lateral — apenas desktop */}
                    <div
                      data-layer-label
                      aria-hidden="true"
                      className={cx(
                        'invisible absolute top-1/2 hidden w-[10.5rem] -translate-y-1/2 items-center gap-3 lg:flex xl:w-[15rem]',
                        side === 'left' ? 'right-[calc(100%+0.5rem)] flex-row-reverse text-right' : 'left-[calc(100%+0.5rem)]',
                      )}
                    >
                      <span className={cx('h-px w-7 shrink-0 xl:w-14 transition-colors duration-300', focus === i ? 'bg-ember-500' : 'bg-cream-100/30')} />
                      <span className="leading-tight">
                        <span className={cx('display block text-xl transition-colors xl:text-2xl duration-300', focus === i ? 'text-ember-400' : 'text-cream-50')}>{layer.label}</span>
                        {layer.detail && <span className="mt-1 block text-sm text-cream-500">{layer.detail}</span>}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rodapé mobile: intro → legenda da camada em foco → CTA */}
          <div className="relative z-10 shrink-0 lg:hidden">
            <div className="relative h-[4.6rem]">
              {!reduce && (
                <p data-intro className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold uppercase tracking-[0.2em] text-cream-500">
                  Role para desmontar ↓
                </p>
              )}
              <div data-caption aria-hidden="true" className={cx('absolute inset-0 flex flex-col items-center justify-center text-center', reduce ? 'hidden' : 'invisible')}>
                <span className="text-[0.7rem] font-bold tabular-nums tracking-[0.25em] text-ember-400">
                  {String(Math.max(focus, 0) + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <span className="display mt-1 text-[1.7rem] text-cream-50">{(focused ?? explodedLayers[0]).label}</span>
                <span className="text-sm text-cream-500">{(focused ?? explodedLayers[0]).detail ?? ' '}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <span className="display text-3xl text-cream-50">{formatMoney(product.price)}</span>
              <Button className="flex-1" onClick={() => openProduct(product.id)}><PlusIcon /> Adicionar</Button>
            </div>
            <p className="mt-2 text-center text-[0.62rem] uppercase tracking-[0.18em] text-cream-500">Ilustração das camadas</p>
          </div>
        </div>

        <p data-outro aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 bottom-6 hidden text-center text-xs font-semibold uppercase tracking-[0.3em] text-cream-500 lg:block">
          Agora é só pedir ↓
        </p>
      </div>

      {/* Conteúdo equivalente para leitores de tela e para movimento reduzido */}
      <div className={reduce ? 'container-x mt-10' : 'sr-only'}>
        <h3 className={reduce ? 'eyebrow mb-3' : undefined}>Ingredientes do {product.name}, de cima para baixo</h3>
        <ol className={reduce ? 'grid gap-2 text-cream-100 sm:grid-cols-2' : undefined}>
          {explodedLayers.map((l) => (
            <li key={l.id}>{l.label}{l.detail ? ` — ${l.detail}` : ''}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
