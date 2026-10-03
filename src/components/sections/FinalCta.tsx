import { scrollToTarget } from '@/hooks/useLenis'
import { Button } from '@/components/ui/Button'
import { ArrowIcon } from '@/components/ui/Icons'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-titulo" className="grain relative isolate overflow-hidden bg-coal-950 py-28 text-center lg:py-40">
      <div className="container-x relative flex flex-col items-center">
        <h2 data-reveal="title" id="cta-titulo" className="display w-full max-w-4xl pt-[0.1em] text-[clamp(2.9rem,12.5vw,7.5rem)] text-cream-50">
          Seu próximo hambúrguer <span className="text-ember-500">começa aqui.</span>
        </h2>
        <Button data-reveal size="lg" className="mt-9 !min-h-16 !px-10 !text-base" onClick={() => scrollToTarget('#cardapio')}>
          Pedir agora <ArrowIcon />
        </Button>
      </div>
    </section>
  )
}
