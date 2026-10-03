import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'

/** Só afirmações verificáveis no cardápio/cadastro da loja. */
const FACTS = [
  { title: 'Pão brioche', text: 'Tostado na manteiga em todos os hambúrgueres da casa.' },
  { title: 'Carne de 100g', text: 'Uma, duas ou três — do Burguer Bacon ao Big Sorriso.' },
  { title: 'Maionese temperada', text: 'Vai no lanche e também à parte, para acompanhar as fritas.' },
  { title: 'Do seu jeito', text: 'Adicionais como ovo, bacon, cebola caramelizada e carne extra.' },
]

/**
 * A Toca. Foto grande com texto por cima + lista com cara de cardápio de
 * lanchonete (linhas tracejadas). Sem história, fundador, data ou depoimento.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Parallax só com deslocamento (±12px), sem escala: a foto nunca passa do tamanho do arquivo.
      gsap.fromTo('[data-exp-img]', { y: -12 }, {
        y: 12, ease: 'none',
        scrollTrigger: { trigger: '[data-exp-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="sobre" aria-labelledby="experiencia-titulo" className="grain relative isolate overflow-hidden bg-coal-900 py-20 lg:py-32">
      <div data-reveal="ambient" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(55%_45%_at_25%_65%,rgb(224_102_26/0.11),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-coal-950 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-coal-950 to-transparent" />

      <div className="container-x">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <p data-reveal className="eyebrow mb-3">A Toca</p>
            <h2 data-reveal="title" id="experiencia-titulo" className="display text-[clamp(2.6rem,11vw,5rem)] text-cream-50">Simples, bem feito, <span className="text-ember-500">com fogo.</span></h2>
          </div>
          <p data-reveal className="max-w-lg text-lg leading-relaxed text-cream-300 lg:pb-2">
            A Toca do Sorriso na Brasa fica no Mendanha, Rio de Janeiro, e abre todas as noites.
            Peça para entregar, retire no balcão ou venha comer aqui.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
          {/* Foto grande com texto por cima. O quadro nunca exige mais que o arquivo (780×351) já
              contando a folga do parallax: 4:3 até 420px no celular; proporção do arquivo a partir de 640px.
              TODO: fotos reais da loja, da chapa e da equipe entram aqui quando existirem. */}
          <figure data-reveal="media" data-exp-frame className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[2rem] sm:aspect-[780/351] sm:max-w-[700px] lg:mx-0">
            <div data-reveal-inner className="absolute inset-0">
              <img
                data-exp-img
                src="/images/categories/hamburguer.webp"
                alt="Três hambúrgueres da Toca do Sorriso servidos na tábua com molhos"
                width={780} height={351} loading="lazy" decoding="async"
                className="absolute inset-x-0 -top-4 h-[calc(100%+2rem)] w-full object-cover will-change-transform"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-coal-950/80 via-coal-950/10 to-transparent" />
            <figcaption className="display absolute bottom-5 left-5 text-[1.7rem] text-cream-50 lg:bottom-6 lg:left-7 lg:text-4xl">Na brasa<br /><span className="text-ember-500">está no nome.</span></figcaption>
          </figure>

          {/* Lista com cara de cardápio de lanchonete */}
          <ul className="border-t border-dashed border-cream-100/20">
            {FACTS.map((f) => (
              <li data-reveal key={f.title} className="border-b border-dashed border-cream-100/20 py-4">
                <span className="display block text-[1.35rem] text-cream-50">{f.title}</span>
                <span className="mt-1 block leading-relaxed text-cream-300">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
