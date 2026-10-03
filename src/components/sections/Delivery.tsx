import { businessInfo, fullAddress } from '@/data/business'
import { deliveryConfig, deliveryZones } from '@/data/delivery'
import { paymentMethods } from '@/data/payments'
import { formatMoney } from '@/lib/format'
import { CardIcon, ClockIcon, MotoIcon, PinIcon, StoreIcon } from '@/components/ui/Icons'

export function Delivery() {
  const fees = deliveryZones.map((z) => z.fee)
  const cards = [
    { icon: <MotoIcon />, label: 'Taxa de entrega', value: `${formatMoney(Math.min(...fees))} a ${formatMoney(Math.max(...fees))}`, hint: 'Conforme o bairro' },
    { icon: <ClockIcon />, label: 'Tempo estimado', value: `~${deliveryConfig.estimatedMinutes.delivery} min`, hint: 'Entrega ou retirada' },
    { icon: <StoreIcon />, label: 'Pedido mínimo', value: formatMoney(deliveryConfig.minimumOrder), hint: 'Em produtos' },
  ]
  return (
    <section id="delivery" aria-labelledby="delivery-titulo" className="relative isolate overflow-hidden bg-coal-950 py-20 lg:py-28">
      <div data-reveal="ambient" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_45%_at_70%_30%,rgb(224_102_26/0.14),transparent_70%)]" />
      <div className="container-x">
        <div className="mb-10 max-w-2xl">
          <p data-reveal className="eyebrow mb-3">Delivery e retirada</p>
          <h2 data-reveal="title" id="delivery-titulo" className="display text-[clamp(2.6rem,11vw,5.5rem)] text-cream-50">Da brasa <span className="text-ember-500">até você.</span></h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:gap-5">
          {cards.map((c) => (
            <li data-reveal="stat" key={c.label} className="rounded-3xl border border-cream-100/10 bg-coal-900 p-5 lg:p-7">
              <span className="grid size-11 place-items-center rounded-full bg-ember-500/15 text-ember-400">{c.icon}</span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-cream-500">{c.label}</p>
              <p className="display mt-1 text-[2.1rem] text-cream-50 lg:text-[2.6rem]">{c.value}</p>
              <p className="mt-1 text-sm text-cream-500">{c.hint}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal className="rounded-3xl border border-cream-100/10 bg-coal-900 p-5 lg:p-7">
            <h3 className="display text-2xl text-cream-50">Bairros atendidos</h3>
            <p className="mt-1 text-sm text-cream-500">A taxa é calculada no carrinho ao escolher o bairro.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {deliveryZones.map((z) => (
                <li key={z.id} className="inline-flex items-center gap-2 rounded-full bg-coal-800 px-3.5 py-2 text-sm text-cream-100">
                  {z.name} <span className="font-bold tabular-nums text-ember-400">{formatMoney(z.fee)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5">
            <div data-reveal className="rounded-3xl border border-cream-100/10 bg-coal-900 p-5 lg:p-7">
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
            <div data-reveal className="rounded-3xl border border-cream-100/10 bg-coal-900 p-5 lg:p-7">
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
