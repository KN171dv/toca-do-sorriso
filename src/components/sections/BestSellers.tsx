import { featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import type { Product } from '@/types'
import { cx } from '@/lib/format'
import { useUi } from '@/store/ui'
import { ArrowIcon } from '@/components/ui/Icons'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { Badges } from '@/components/menu/badges'
import { Price } from '@/components/menu/Price'

export function BestSellers() {
  const openProduct = useUi((s) => s.openProduct)
  const items = featured.bestSellerIds.map((id) => getProduct(id)).filter((p): p is Product => !!p && p.active)

  return (
    <section id="mais-pedidos" aria-labelledby="mais-pedidos-titulo" className="relative isolate overflow-hidden bg-coal-900 py-20 lg:py-28">
      <div data-reveal="ambient" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_45%_at_80%_20%,rgb(224_102_26/0.09),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-coal-950 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-coal-950 to-transparent" />
      <div className="container-x">
        <div className="mb-8 lg:mb-12">
          <p data-reveal className="eyebrow mb-3">Mais pedidos</p>
          <h2 data-reveal="title" id="mais-pedidos-titulo" className="display text-[clamp(2.6rem,11vw,5.5rem)] text-cream-50">Os queridinhos <span className="text-ember-500">da Toca.</span></h2>
        </div>
      </div>

      {/* Mobile: carrossel com snap (o próximo card aparece na borda) · Desktop: o 1º card é mais largo e tem título maior.
          Altura fixa de 30rem: a foto (500px) nunca é ampliada além do arquivo. */}
      <ul className="no-scrollbar flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,2.5rem)] gap-3.5 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] pb-2 lg:mx-auto lg:grid lg:max-w-[1240px] lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-6 lg:overflow-visible">
        {items.map((p, i) => (
          <li key={p.id} className="w-[76vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <article data-reveal="media" className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] border border-cream-100/10 shadow-[inset_0_1px_0_rgb(246_231_206/0.08),0_24px_50px_-30px_rgb(0_0_0/0.9)] transition-[border-color,translate] duration-300 ease-out hover:-translate-y-1 hover:border-ember-500/40 lg:aspect-auto lg:h-[30rem]">
              <ProductPhoto image={p.image} name={p.name} size="lg" sizes="(min-width:1024px) 480px, min(95vw, 425px)" className="absolute inset-0 -z-10 [&_img]:transition-transform [&_img]:duration-[900ms] [&_img]:ease-out group-hover:[&_img]:scale-[1.07]" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-coal-950 via-coal-950/55 to-transparent" />
              <span aria-hidden="true" className="absolute right-5 top-5 text-xs font-bold tabular-nums tracking-[0.2em] text-cream-50/45">0{i + 1}</span>
              <Badges badges={p.badges} className="absolute left-5 top-5" />
              <div className="p-5 lg:p-6">
                <h3 className={cx('display text-[2.2rem] text-cream-50', i === 0 ? 'lg:text-[3.4rem]' : 'lg:text-[2.5rem]')}>
                  <button type="button" onClick={() => openProduct(p.id)} className="text-left uppercase after:absolute after:inset-0 after:rounded-[2rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ember-400">
                    {p.name}
                  </button>
                </h3>
                <p className={cx('mt-2 text-[0.95rem] leading-snug text-cream-300', i === 0 ? 'line-clamp-2 lg:line-clamp-3 lg:max-w-[26rem]' : 'line-clamp-2')}>{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Price product={p} className="text-2xl" />
                  <span aria-hidden="true" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ember-500 px-5 text-sm font-bold uppercase tracking-[0.08em] text-coal-950 transition-colors group-hover:bg-ember-400">
                    Pedir <ArrowIcon width={16} height={16} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
