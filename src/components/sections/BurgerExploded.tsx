import { useEffect, useRef } from 'react'
import { BURGER_FRAME_RATIO, BURGER_MAX_SPREAD, burgerPieces } from '@/data/burger3d'
import { burgerLabels, featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import { cx, formatMoney } from '@/lib/format'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@/components/ui/Icons'

const P = burgerPieces.length
/** Nomes únicos, na ordem de montagem (legenda do mobile). */
const INGREDIENTS = [...new Set(burgerLabels.map((l) => l.label))]

/** "Carne 100g" em caixa alta sem virar "100G". */
const unit = (text: string) => text.split(/(?<=\d)(g)\b/).map((part, i) => (i % 2 ? <span key={i} className="normal-case">{part}</span> : part))

/** Deslocamento de cada peça até a posição aberta, em % da própria altura. */
const openShift = (i: number) => (burgerPieces[i].spread / burgerPieces[i].h) * 100

/**
 * Hambúrguer em destaque — abre uma vez e fica aberto.
 *
 * As 6 peças são recortes da foto "hambúrguer 3D" (vista explodida). Montado =
 * peças aproximadas; aberto = posição da foto original (nunca além dela).
 *
 * · Antes do gatilho: montado e imóvel (nenhuma animação em loop).
 * · Com o hambúrguer passando de 70% da tela, a timeline toca por tempo: as
 *   camadas se afastam, os rótulos entram com conectores (desktop) ou a lista de
 *   ingredientes aparece (mobile), e o "Adicionar" ganha destaque no fim.
 * · Fica aberto. Se a pessoa passar direto, voltar de baixo, trocar de aba ou a
 *   animação não terminar a tempo, a seção vai para o estado final.
 *
 * O palco reserva a altura do estado aberto (--open: 0,75 no mobile, 1 no
 * desktop), então nada muda de tamanho. Movimento reduzido: aberto desde o
 * início, desenhado em CSS, sem animação.
 */
export function BurgerExploded() {
  const section = useRef<HTMLElement>(null)
  const reduce = usePrefersReducedMotion()
  const product = getProduct(featured.explodedProductId)!
  const openProduct = useUi((s) => s.openProduct)

  useEffect(() => {
    const mm = gsap.matchMedia(section)
    mm.add(
      {
        desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        compact: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean }
        const area = section.current!.querySelector<HTMLElement>('[data-stage]')!
        const pieces = gsap.utils.toArray<HTMLElement>('[data-piece]')
        const arts = gsap.utils.toArray<HTMLElement>('[data-art]')
        const lines = gsap.utils.toArray<HTMLElement>('[data-label-line]')
        const texts = gsap.utils.toArray<HTMLElement>('[data-label-text]')
        const chips = gsap.utils.toArray<HTMLElement>('[data-chip]')
        const open = parseFloat(getComputedStyle(area).getPropertyValue('--open')) || 1

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
          .fromTo(pieces, { yPercent: 0 }, { yPercent: (i) => openShift(i) * open, duration: 1, stagger: { each: 0.035, from: 'center' } }, 0)
          .fromTo(arts, { rotation: 0 }, { rotation: (i) => (i % 2 ? 1 : -1), duration: 1 }, 0)
          .fromTo('[data-glow]', { scale: 1, opacity: 0.75 }, { scale: 1.15, opacity: 1, duration: 1.1 }, 0)
          .fromTo('[data-shadow]', { scaleX: 1, opacity: 0.75 }, { scaleX: 0.82, opacity: 0.45, duration: 1 }, 0)
        if (desktop) {
          tl.fromTo(lines, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.45, ease: 'power3.out', stagger: 0.11 }, 0.55)
            .fromTo(texts, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.11 }, 0.65)
        } else {
          tl.fromTo(chips, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, 0.5)
        }
        // destaque do CTA quando o último rótulo entra
        tl.fromTo('[data-cta-ring]', { scale: 1, opacity: 0.7 }, { scale: 1.3, opacity: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, '>-0.1')
          .fromTo('[data-cta]', { scale: 1 }, { scale: 1.04, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, '<')

        let failsafe = 0
        const finish = () => { window.clearTimeout(failsafe); if (tl.progress() < 1) tl.progress(1) }
        const play = () => {
          if (tl.progress() > 0) return
          tl.play()
          failsafe = window.setTimeout(finish, (tl.duration() + 1.2) * 1000)
        }
        const onVisibility = () => { if (document.hidden && tl.progress() > 0) finish() }
        document.addEventListener('visibilitychange', onVisibility)

        ScrollTrigger.create({ trigger: '[data-frame]', start: 'center 70%', once: true, onEnter: play })
        // passou direto / voltou de baixo / saiu no meio → estado final, sem tocar de novo
        ScrollTrigger.create({
          trigger: section.current,
          start: 'top bottom',
          end: 'bottom top',
          onLeave: finish,
          onEnterBack: finish,
          onLeaveBack: () => { if (tl.progress() > 0) finish() },
        })

        return () => {
          window.clearTimeout(failsafe)
          document.removeEventListener('visibilitychange', onVisibility)
        }
      },
    )
    return () => mm.revert()
  }, [])

  const cta = (
    <div className="flex items-center gap-4 lg:gap-5">
      <span className="display text-3xl text-cream-50 lg:order-2 lg:text-4xl">{formatMoney(product.price)}</span>
      <div data-cta className="relative flex-1 lg:flex-none">
        <span data-cta-ring aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border-2 border-ember-400 opacity-0" />
        <Button size="lg" full className="lg:w-auto" onClick={() => openProduct(product.id)}>
          <PlusIcon /> Adicionar
        </Button>
      </div>
    </div>
  )

  return (
    <section ref={section} id="destaque" data-scroll-offset="0" aria-labelledby="destaque-titulo" className="grain relative isolate overflow-hidden bg-coal-950">
      {/* Luz contínua com o hero: o calor de baixo do hero vira o brilho atrás do hambúrguer */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_38%_at_50%_0%,rgb(224_102_26/0.16),transparent_70%),radial-gradient(70%_50%_at_50%_55%,rgb(184_72_15/0.24),transparent_72%)] lg:bg-[radial-gradient(60%_32%_at_60%_0%,rgb(224_102_26/0.14),transparent_70%),radial-gradient(45%_60%_at_62%_52%,rgb(184_72_15/0.26),transparent_72%)]" />

      <div
        className={cx(
          'container-x grid min-h-[100svh] max-lg:max-w-[560px] content-center gap-y-4 pb-8 pt-[84px] lg:min-h-[max(100svh,720px)] lg:gap-x-10 lg:gap-y-7 lg:pb-12 lg:pt-[88px]',
          '[grid-template-areas:"text""stage""chips""cta"] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:[grid-template-areas:".stage""text_stage""cta_stage""chips_stage"".stage"]',
        )}
      >
        <div className="[grid-area:text]">
          <p className="eyebrow mb-2 lg:mb-4">Destaque da casa</p>
          <h2 id="destaque-titulo" className="display text-[clamp(2.1rem,9.5vw,3.2rem)] text-cream-50 lg:text-[clamp(3rem,4.6vw,4.5rem)]">
            {product.name},<br className="hidden lg:block" /> <span className="text-ember-500">camada por camada.</span>
          </h2>
          <p className="mt-4 hidden max-w-md text-lg leading-relaxed text-cream-300 lg:block">{product.description}</p>
        </div>

        {/* Palco: altura = hambúrguer montado + espaço para abrir (--open) */}
        <div
          data-stage
          className={cx(
            'relative flex items-center justify-center self-center [grid-area:stage] [--bw:min(60vw,31svh,330px)] [--open:0.75] lg:pr-[13rem] lg:[--bw:min(30vw,calc((100svh-220px)/1.43),560px)] lg:[--open:1] xl:pr-[15rem]',
          )}
          style={{ height: `calc(var(--bw) / ${BURGER_FRAME_RATIO} * (1 + ${BURGER_MAX_SPREAD / 100} * var(--open)))` }}
        >
          <div className="relative">
            <div data-glow aria-hidden="true" className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgb(245_138_42/0.34),rgb(224_102_26/0.12)_55%,transparent)] opacity-75" />
              <div data-frame className="relative w-[var(--bw)]" style={{ aspectRatio: BURGER_FRAME_RATIO }}>
                {burgerPieces.map((p, i) => (
                  <div
                    key={p.id}
                    data-piece
                    className="absolute will-change-transform"
                    style={{
                      left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`, zIndex: P - i,
                      // movimento reduzido: já aberto, sem timeline
                      transform: reduce ? `translateY(calc(${openShift(i)}% * var(--open)))` : undefined,
                    }}
                  >
                    {i === P - 1 && (
                      <div data-shadow aria-hidden="true" className="absolute inset-x-[6%] top-[86%] h-[34%] rounded-[50%] bg-black opacity-75 blur-xl" />
                    )}
                    <img
                      data-art
                      src={p.src}
                      srcSet={`${p.srcSmall} ${p.widthSmall}w, ${p.src} ${p.width}w`}
                      sizes={`(min-width: 1024px) ${Math.round(p.w * 4.2)}px, min(${Math.round(p.w * 0.6)}vw, ${Math.round(p.w * 3.3)}px)`}
                      width={p.width} height={p.height}
                      alt="" aria-hidden="true" draggable={false}
                      loading="lazy" decoding="async"
                      className="relative block size-full"
                      style={{ rotate: reduce ? `${i % 2 ? 1 : -1}deg` : undefined }}
                    />
                    {/* Rótulos com conector — só desktop; filhos da peça, então acompanham o movimento */}
                    {burgerLabels.filter((l) => l.piece === p.id).map((l) => (
                      <div key={l.id} aria-hidden="true" className="hidden lg:block">
                        <span
                          data-label-line
                          className="absolute block h-px origin-left bg-gradient-to-r opacity-0 motion-reduce:opacity-100 from-cream-50/80 to-cream-100/25 before:absolute before:-left-[3px] before:-top-[2.5px] before:size-1.5 before:rounded-full before:bg-cream-50"
                          style={{ top: `${l.at * 100}%`, left: `${((l.edge - p.x) / p.w) * 100}%`, width: `calc(${((100 - l.edge) / p.w) * 100}% + 2.25rem)` }}
                        />
                        <span
                          data-label-text
                          className="absolute w-[12rem] -translate-y-1/2 leading-tight opacity-0 motion-reduce:opacity-100 xl:w-[14rem]"
                          style={{ top: `${l.at * 100}%`, left: `calc(${((100 - p.x) / p.w) * 100}% + 2.75rem)` }}
                        >
                          <span className="display block text-xl text-cream-50 xl:text-2xl">{unit(l.label)}</span>
                          {l.detail && <span className="mt-0.5 block text-sm text-cream-500">{l.detail}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
          </div>

        </div>

        {/* Ingredientes no mobile/tablet (no desktop os rótulos fazem esse papel) */}
        <ul aria-hidden="true" className="flex flex-wrap justify-center gap-1.5 [grid-area:chips] lg:hidden">
          {INGREDIENTS.map((name) => (
            <li key={name} data-chip className="rounded-full opacity-0 motion-reduce:opacity-100 border border-cream-100/12 bg-coal-900/70 px-3 py-1.5 text-[0.8rem] font-semibold text-cream-100">
              {name}
            </li>
          ))}
        </ul>

        <div className="[grid-area:cta]">
          {cta}
          <p className="mt-2 text-center text-[0.62rem] uppercase tracking-[0.18em] text-cream-500 lg:mt-5 lg:text-left lg:text-xs">Imagem ilustrativa</p>
        </div>
      </div>

      {/* Conteúdo equivalente para leitores de tela */}
      <div className="sr-only">
        <h3>Ingredientes do {product.name}, de cima para baixo</h3>
        <ol>
          {burgerLabels.map((l) => (
            <li key={l.id}>{l.label}{l.detail ? ` — ${l.detail}` : ''}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
