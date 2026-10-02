import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'

/** Só afirmações verificáveis no cardápio/cadastro da loja. */
const FACTS = [
  { n: '01', title: 'Pão brioche', text: 'Tostado na manteiga em todos os hambúrgueres da casa.' },
  { n: '02', title: 'Carne de 100g', text: 'Uma, duas ou três — do Burguer Bacon ao Big Sorriso.' },
  { n: '03', title: 'Maionese temperada', text: 'Vai no lanche e também à parte, para acompanhar as fritas.' },
  { n: '04', title: 'Do seu jeito', text: 'Adicionais como ovo, bacon, cebola caramelizada e carne extra.' },
]

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-exp-img]', { yPercent: -8, scale: 1.12 }, {
        yPercent: 8, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '[data-exp-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="experiencia-titulo" className="grain relative isolate overflow-hidden bg-coal-900 py-20 lg:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div data-reveal data-exp-frame className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <img
            data-exp-img
            src="/images/categories/hamburguer.webp"
            alt="Três hambúrgueres da Toca do Sorriso servidos na tábua com molhos"
            width={780} height={351} loading="lazy" decoding="async"
            className="size-full object-cover will-change-transform"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-coal-950/70 to-transparent" />
          <p className="display absolute bottom-5 left-5 text-3xl text-cream-50 lg:text-4xl">Na brasa<br /><span className="text-ember-500">está no nome.</span></p>
        </div>

        <div>
          <p data-reveal className="eyebrow mb-3">A Toca</p>
          <h2 data-reveal id="experiencia-titulo" className="display text-[clamp(2.6rem,11vw,5rem)] text-cream-50">Simples, bem feito, <span className="text-ember-500">com fogo.</span></h2>
          <p data-reveal className="mt-5 max-w-lg text-lg leading-relaxed text-cream-300">
            A Toca do Sorriso na Brasa fica no Mendanha, Rio de Janeiro, e abre todas as noites.
            Peça para entregar, retire no balcão ou venha comer aqui.
          </p>
          <dl className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div data-reveal key={f.n} className="border-t border-cream-100/15 pt-4">
                <dt className="flex items-baseline gap-3">
                  <span className="text-xs font-bold tabular-nums tracking-[0.2em] text-ember-500">{f.n}</span>
                  <span className="display text-2xl text-cream-50">{f.title}</span>
                </dt>
                <dd className="mt-2 text-cream-500">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
