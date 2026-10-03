import { businessInfo, fullAddress } from '@/data/business'
import { deliveryConfig, deliveryZones } from '@/data/delivery'
import { paymentMethods } from '@/data/payments'
import { formatMoney } from '@/lib/format'

export function Delivery() {
  const fees = deliveryZones.map((z) => z.fee)
  const facts = [
    { label: 'Taxa de entrega', value: `${formatMoney(Math.min(...fees))} a ${formatMoney(Math.max(...fees))}`, hint: 'Conforme o bairro' },
    { label: 'Tempo estimado', value: `~${deliveryConfig.estimatedMinutes.delivery} min`, hint: 'Entrega ou retirada' },
    { label: 'Pedido mínimo', value: formatMoney(deliveryConfig.minimumOrder), hint: 'Em produtos' },
  ]
  return (
    <section id="delivery" aria-labelledby="delivery-titulo" className="relative bg-coal-950 py-24 lg:py-36">
      <div className="container-x">
        <h2 data-reveal="title" id="delivery-titulo" className="display text-[clamp(2.2rem,8vw,3.6rem)] text-cream-50">Entrega e retirada</h2>

        {/* Uma linha de informação, não três cartões */}
        <dl className="mt-8 grid divide-y divide-cream-100/12 border-y border-cream-100/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {facts.map((f) => (
            <div data-reveal="stat" key={f.label} className="flex items-baseline justify-between gap-4 py-4 sm:block sm:px-6 sm:py-6 sm:first:pl-0">
              <dt className="text-sm text-cream-500">{f.label}</dt>
              <dd className="text-right sm:mt-1 sm:text-left">
                <span className="display block text-[1.7rem] text-cream-50 sm:text-[2.2rem]">{f.value}</span>
                <span className="text-xs text-cream-500 sm:text-sm">{f.hint}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 data-reveal className="text-lg font-bold text-cream-50">Bairros atendidos</h3>
            <p data-reveal className="mt-1 text-sm text-cream-500">A taxa é calculada no carrinho ao escolher o bairro.</p>
            {/* Tabela de preços: nome à esquerda, taxa à direita, colunas alinhadas */}
            <ul data-reveal className="mt-5 gap-x-10 sm:columns-2">
              {deliveryZones.map((z) => (
                <li key={z.id} className="flex break-inside-avoid items-baseline gap-2 py-1.5 text-[0.95rem]">
                  <span className="text-cream-100">{z.name}</span>
                  <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-cream-100/25" />
                  <span className="font-semibold tabular-nums text-cream-50">{formatMoney(z.fee)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div data-reveal>
              <h3 className="text-lg font-bold text-cream-50">Pagamento</h3>
              <ul className="mt-3 space-y-2">
                {paymentMethods.filter((p) => p.active).map((p) => (
                  <li key={p.id} className="text-cream-100">
                    {p.name}
                    {p.hint && <span className="block text-sm text-cream-500">{p.hint}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <h3 className="text-lg font-bold text-cream-50">Retirada no local</h3>
              <p className="mt-3 text-cream-100">{fullAddress()}</p>
              <p className="mt-1 text-sm text-cream-500">{businessInfo.address.reference}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
