import { businessInfo } from '@/data/business'
import { buttonClass } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/Icons'

/**
 * Bloco simples e honesto: o @, um convite e o botão. Sem faixa de fotos
 * (eram fotos do cardápio, não posts). TODO: quando houver posts reais, dá para
 * mostrar duas ou três fotos paradas aqui.
 */
export function Instagram() {
  return (
    <section id="instagram" aria-labelledby="instagram-titulo" className="relative isolate overflow-hidden bg-coal-900 py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-coal-950 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-coal-950 to-transparent" />
      <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div data-reveal>
          <h2 id="instagram-titulo" className="text-sm font-semibold text-cream-500">Instagram</h2>
          <a href={businessInfo.instagram.url} target="_blank" rel="noopener noreferrer" className="display mt-1 inline-block text-[clamp(1.9rem,7vw,3rem)] text-cream-50 underline decoration-cream-100/20 decoration-2 underline-offset-[0.18em] transition-colors hover:text-ember-400 hover:decoration-ember-400/50">
            {businessInfo.instagram.handle}
          </a>
          <p className="mt-2 text-cream-300">Siga a Toca no Instagram.</p>
        </div>
        <a data-reveal href={businessInfo.instagram.url} target="_blank" rel="noopener noreferrer" className={`${buttonClass('outline', 'lg')} shrink-0 self-start whitespace-nowrap sm:self-auto`}>
          <InstagramIcon /> Abrir Instagram
        </a>
      </div>
    </section>
  )
}
