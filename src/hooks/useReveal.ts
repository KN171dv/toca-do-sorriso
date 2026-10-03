import { useEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from '@/lib/motion'

type Kind = 'rise' | 'title' | 'media' | 'stat' | 'ambient'

/** Acima disso (px/s) a pessoa está passando direto: o conteúdo aparece pronto. */
const FAST_SCROLL = 2600

/**
 * Revelação de conteúdo ao rolar. Cada elemento marcado com [data-reveal]
 * anima UMA vez, só com transform/opacity (e clip-path nas imagens):
 *
 *   data-reveal            → "rise": sobe e aparece (texto, cards, botões)
 *   data-reveal="title"    → títulos: linhas sobem de dentro de uma máscara
 *                            (≥768px; no celular, "rise" — mais leve)
 *   data-reveal="media"    → fotos e cards grandes: recorte se abre e a imagem
 *                            ([data-reveal-inner] ou a 1ª <img>) assenta de 1,06 → 1
 *   data-reveal="stat"     → números de destaque: entrada com mais presença
 *   data-reveal="ambient"  → brilho de fundo da seção: acende devagar
 *
 * Itens que entram juntos (mesma linha de uma grade) são escalonados.
 *
 * Proteções — o conteúdo nunca fica invisível esperando a animação:
 *  · já passou da tela (âncora) ou rolagem rápida → estado final na hora;
 *  · cada animação tem prazo; se não terminar (aba em segundo plano, navegador
 *    pausando quadros), vai direto ao fim;
 *  · ao voltar para a aba, tudo que está pendente/na tela termina;
 *  · item na tela há 2,2 s ainda oculto (IntersectionObserver) termina;
 *  · foco do teclado num item ainda oculto o revela na hora.
 * Nada usa visibility: hidden, então tudo continua focável.
 * Com prefers-reduced-motion nada é escondido.
 */
export function useReveal(): void {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean }
        const stagger = desktop ? 0.07 : 0.04
        const pending = new Map<HTMLElement, () => void>() // elemento → leva ao estado final
        const timers = new Set<number>()
        const splits: SplitText[] = []
        const speed = ScrollTrigger.create({}) // só para ler a velocidade da rolagem

        const kindOf = (el: HTMLElement): Kind => {
          const k = (el.dataset.reveal || 'rise') as Kind
          return k === 'title' && !desktop ? 'rise' : k
        }
        const inner = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-reveal-inner]') ?? el.querySelector('img')
        const radius = (el: HTMLElement) => getComputedStyle(el).borderTopLeftRadius || '0px'

        /** Estado oculto inicial de cada tipo. */
        const hide = (el: HTMLElement) => {
          const kind = kindOf(el)
          if (kind === 'title') {
            // autoSplit: refaz as linhas quando a fonte carrega ou a largura muda (antes de animar)
            const split = SplitText.create(el, {
              type: 'lines', mask: 'lines', aria: 'auto', autoSplit: true,
              onSplit: (self) => { if (pending.has(el)) gsap.set(self.lines, { yPercent: 105 }) },
            })
            splits.push(split)
            gsap.set(split.lines, { yPercent: 105 })
            pending.set(el, () => { gsap.killTweensOf(split.lines); split.kill(); split.revert() })
            ;(el as HTMLElement & { _split?: SplitText })._split = split
            return
          }
          if (kind === 'media') {
            gsap.set(el, { clipPath: `inset(12% 8% 12% 8% round ${radius(el)})` })
            const img = inner(el)
            if (img) gsap.set(img, { scale: 1.06 })
            pending.set(el, () => {
              gsap.set(el, { clearProps: 'clipPath' })
              if (img) { gsap.killTweensOf(img); gsap.set(img, { clearProps: 'transform' }) }
            })
            return
          }
          if (kind === 'stat') gsap.set(el, { opacity: 0, y: 36, scale: 0.96 })
          else if (kind === 'ambient') gsap.set(el, { opacity: 0 })
          else gsap.set(el, { opacity: 0, y: desktop ? 26 : 18 })
          pending.set(el, () => gsap.set(el, { clearProps: 'opacity,transform' }))
        }

        const finish = (el: HTMLElement) => {
          const done = pending.get(el)
          if (!done) return
          pending.delete(el)
          gsap.killTweensOf(el)
          done()
        }

        /** Anima um elemento; se não terminar no prazo, vai ao estado final. */
        const animate = (el: HTMLElement, delay: number) => {
          if (!pending.has(el)) return
          const kind = kindOf(el)
          const end = () => finish(el)
          let duration = 0.75
          if (kind === 'title') {
            const split = (el as HTMLElement & { _split?: SplitText })._split!
            duration = 0.9 + split.lines.length * 0.08
            gsap.to(split.lines, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay, onComplete: end })
          } else if (kind === 'media') {
            const img = inner(el)
            duration = 1
            gsap.to(el, { clipPath: `inset(0% 0% 0% 0% round ${radius(el)})`, duration: 1, ease: 'expo.out', delay, onComplete: end })
            if (img) gsap.to(img, { scale: 1, duration: 1, ease: 'power3.out', delay })
          } else if (kind === 'stat') {
            duration = 0.9
            gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', delay, onComplete: end })
          } else if (kind === 'ambient') {
            duration = 1
            gsap.to(el, { opacity: 1, duration: 1, ease: 'power2.out', delay, onComplete: end })
          } else {
            duration = 0.7
            gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay, onComplete: end })
          }
          const t = window.setTimeout(() => { timers.delete(t); end() }, (delay + duration) * 1000 + 600)
          timers.add(t)
        }

        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        // O que já está acima da tela (ex.: recarregou no meio da página) não esconde.
        items.filter((el) => el.getBoundingClientRect().bottom > 0).forEach(hide)

        const batches = ScrollTrigger.batch(items.filter((el) => pending.has(el)), {
          start: 'top 92%',
          once: true,
          interval: 0.08,
          onEnter: (batch) => {
            const els = batch as HTMLElement[]
            const fast = Math.abs(speed.getVelocity()) > FAST_SCROLL
            let i = 0
            for (const el of els) {
              // passou da tela (âncora / rolagem rápida) → pronto, sem fila
              if (fast || el.getBoundingClientRect().bottom < 0) finish(el)
              else animate(el, i++ * stagger)
            }
          },
        })

        // Aba em segundo plano / quadros pausados: ao voltar, termina o que está na tela ou acima.
        const onVisibility = () => {
          for (const el of [...pending.keys()]) if (el.getBoundingClientRect().top < window.innerHeight) finish(el)
        }
        // Teclado: foco num item ainda oculto revela na hora.
        const onFocus = (e: FocusEvent) => {
          const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-reveal]')
          if (el) finish(el)
        }
        document.addEventListener('visibilitychange', onVisibility)
        document.addEventListener('focusin', onFocus)
        // Rede de segurança independente do GSAP: se o item está na tela há 2,2 s e
        // continua oculto (gatilho não disparou, quadros pausados), vai ao estado final.
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) {
            const el = e.target as HTMLElement
            if (!e.isIntersecting || !pending.has(el)) continue
            const t = window.setTimeout(() => { timers.delete(t); finish(el) }, 2200)
            timers.add(t)
            io.unobserve(el)
          }
        })
        pending.forEach((_, el) => io.observe(el))

        return () => {
          document.removeEventListener('visibilitychange', onVisibility)
          document.removeEventListener('focusin', onFocus)
          io.disconnect()
          timers.forEach((t) => window.clearTimeout(t))
          batches.forEach((t) => t.kill())
          speed.kill()
          for (const el of [...pending.keys()]) finish(el)
          splits.forEach((s) => { s.kill(); s.revert() })
        }
      },
    )
    return () => mm.revert()
  }, [])
}
