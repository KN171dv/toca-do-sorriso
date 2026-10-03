import { businessInfo, fullAddress } from '@/data/business'
import { deliveryConfig, deliveryZones } from '@/data/delivery'
import { paymentMethods } from '@/data/payments'
import { CardIcon, ClockIcon, MotoIcon, PinIcon, StoreIcon } from '@/components/ui/Icons'
import { Money } from '@/components/ui/Money'

export function Delivery() {
  const fees = deliveryZones.map((z) => z.fee)
  const facts = [
    { icon: <MotoIcon />, label: 'Taxa de entrega', value: <><Money value={Math.min(...fees)} /> <span className="text-[0.6em] text-cream-300">a</span> <Money value={Math.max(...fees)} /></>, hint: 'Conforme o bairro' },
    { icon: <ClockIcon />, label: 'Tempo estimado', value: <>~{deliveryConfig.estimatedMinutes.delivery} <span className="text-[0.6em]">min</span></>, hint: 'Entrega ou retirada' },
    { icon: <StoreIcon />, label: 'Pedido mínimo', value: <Money value={deliveryConfig.minimumOrder} />, hint: 'Em produtos' },
  ]
  return (
    <section id="delivery" aria-labelledby="delivery-titulo" className="relative isolate overflow-hidden bg-coal-950 py-20 lg:py-28">
      <div data-reveal="ambient" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_45%_at_70%_30%,rgb(224_102_26/0.09),transparent_70%)]" />
      <div className="container-x">
        <div className="mb-10 max-w-2xl">
          <p data-reveal className="eyebrow mb-3">Delivery e retirada</p>
          <h2 data-reveal="title" id="delivery-titulo" className="display text-[clamp(2.6rem,11vw,5.5rem)] text-cream-50">Da brasa <span className="text-ember-500">até você.</span></h2>
        </div>

        {/* Painel único e quente: os três números lado a lado, divisores finos */}
        <div className="card-surface relative isolate overflow-hidden rounded-[2rem]">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_15%_0%,rgb(245_138_42/0.16),transparent_60%),radial-gradient(60%_120%_at_100%_100%,rgb(184_72_15/0.14),transparent_60%)]" />
          <dl className="grid divide-y divide-cream-100/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((f) => (
              <div data-reveal="stat" key={f.label} className="px-5 py-5 sm:px-7 sm:py-8">
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cream-500">
                  <span className="text-ember-400 [&_svg]:size-[18px]">{f.icon}</span> {f.label}
                </dt>
                <dd className="mt-2">
                  <span className="display block whitespace-nowrap text-[2.1rem] text-cream-50 lg:text-[2.7rem]">{f.value}</span>
                  <span className="mt-1 block text-sm text-cream-500">{f.hint}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal className="card-surface rounded-3xl p-5 lg:p-7">
            <h3 className="display text-2xl text-cream-50">Bairros atendidos</h3>
            <p className="mt-1 text-sm text-cream-500">A taxa é calculada no carrinho ao escolher o bairro.</p>
            {/* Tabela de duas colunas: nome à esquerda, taxa à direita */}
            <ul className="mt-5 gap-x-8 sm:columns-2">
              {deliveryZones.map((z) => (
                <li key={z.id} className="flex break-inside-avoid items-baseline gap-2 py-1.5 text-[0.95rem]">
                  <span className="text-cream-100">{z.name}</span>
                  <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-cream-100/20" />
                  <Money value={z.fee} className="font-bold text-ember-400" />
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5">
            <div data-reveal className="card-surface rounded-3xl p-5 lg:p-7">
              <h3 className="display flex items-center gap-3 text-2xl text-cream-50"><CardIcon className="text-ember-400" /> Pagamento</h3>
              <ul className="mt-4 space-y-2.5">
                {paymentMethods.filter((p) => p.active).map((p) => (
                  <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-cream-100/8 pb-2.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-cream-100">{p.name}</span>
                    {p.hint && <span className="text-sm text-cream-500">{p.hint}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="card-surface rounded-3xl p-5 lg:p-7">
              <h3 className="display flex items-center gap-3 text-2xl text-cream-50"><PinIcon className="text-ember-400" /> Retirada no local</h3>
              <p className="mt-3 text-cream-100">{fullAddress()}</p>
              <p className="mt-1 text-sm text-cream-500">{businessInfo.address.reference}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
