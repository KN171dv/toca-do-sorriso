import { scrollToTarget } from '@/hooks/useLenis'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { Button } from '@/components/ui/Button'
import { Embers } from '@/components/ui/Embers'
import { ArrowIcon } from '@/components/ui/Icons'
import { StatusPill } from '@/components/ui/StatusPill'

export function FinalCta() {
  const status = useStoreStatus()
  return (
    <section aria-labelledby="cta-titulo" className="grain relative isolate overflow-hidden bg-coal-950 py-28 text-center lg:py-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_50%_110%,rgb(224_102_26/0.45),transparent_65%)]" />
      <Embers count={18} />
      <div className="container-x relative flex flex-col items-center">
        <StatusPill status={status} />
        <h2 data-reveal id="cta-titulo" className="display mt-6 max-w-4xl text-[clamp(2.9rem,12.5vw,7.5rem)] text-cream-50">
          Seu próximo hambúrguer <span className="text-ember-500">começa aqui.</span>
        </h2>
        <Button data-reveal size="lg" className="mt-9 !min-h-16 !px-10 !text-base" onClick={() => scrollToTarget('#cardapio')}>
          Pedir agora <ArrowIcon />
        </Button>
      </div>
    </section>
  )
}
