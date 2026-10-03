import { businessInfo } from '@/data/business'
import { featured } from '@/data/featured'
import { getProduct } from '@/lib/catalog'
import { buttonClass } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/Icons'

export function Instagram() {
  const photos = featured.galleryIds.map((id) => getProduct(id)).filter((p) => p?.image)
  const strip = [...photos, ...photos] // duplicado para o loop contínuo

  return (
    <section id="instagram" aria-labelledby="instagram-titulo" className="relative isolate overflow-hidden bg-coal-900 py-20 lg:py-28">
      <div data-reveal="ambient" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_45%_at_50%_100%,rgb(224_102_26/0.14),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-coal-950 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-coal-950 to-transparent" />
      <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div data-reveal>
          <p className="eyebrow mb-3">Instagram</p>
          <h2 id="instagram-titulo" className="display text-[clamp(2.4rem,10vw,5.5rem)] text-cream-50">
            Segue a Toca: <a href={businessInfo.instagram.url} target="_blank" rel="noopener noreferrer" className="text-ember-500 underline decoration-ember-500/30 decoration-2 underline-offset-[0.15em] transition-colors hover:text-ember-400">{businessInfo.instagram.handle}</a>
          </h2>
        </div>
        <a data-reveal href={businessInfo.instagram.url} target="_blank" rel="noopener noreferrer" className={`${buttonClass('outline', 'lg')} shrink-0 self-start whitespace-nowrap lg:self-auto`}>
          <InstagramIcon /> Abrir Instagram
        </a>
      </div>

      {/* Fotos reais do cardápio (não é um feed do Instagram) */}
      <div data-reveal aria-hidden="true" className="mt-10 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {strip.map((p, i) => (
            <img key={i} src={p!.image!.srcSmall} alt="" width={320} height={320} loading="lazy" decoding="async" className="size-44 rounded-3xl object-cover lg:size-64" />
          ))}
        </div>
      </div>
    </section>
  )
}
