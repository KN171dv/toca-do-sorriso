import { deliveryConfig } from '@/data/delivery'
import { cx, formatMoney } from '@/lib/format'
import { cartCount, cartSubtotal, lineTotal, missingForMinimum } from '@/lib/pricing'
import { scrollToTarget } from '@/hooks/useLenis'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { ArrowIcon, BagIcon, CloseIcon, TrashIcon } from '@/components/ui/Icons'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Sheet } from '@/components/ui/Sheet'

export function CartDrawer() {
  const { panel, setPanel } = useUi()
  const { lines, setQuantity, remove } = useCart()
  const subtotal = cartSubtotal(lines)
  const missing = missingForMinimum(subtotal)
  const close = () => setPanel('none')
  const progress = Math.min(100, (subtotal / deliveryConfig.minimumOrder) * 100)

  return (
    <Sheet open={panel === 'cart'} onClose={close} labelledBy="carrinho-titulo" variant="drawer" className="h-[94dvh] md:h-dvh">
      <header className="flex shrink-0 items-center justify-between border-b border-cream-100/10 px-5 py-4">
        <h2 id="carrinho-titulo" className="display text-2xl text-cream-50">
          Seu pedido {lines.length > 0 && <span className="text-cream-500">({cartCount(lines)})</span>}
        </h2>
        <button type="button" onClick={close} aria-label="Fechar carrinho" className="grid size-11 place-items-center rounded-full text-cream-100 transition-colors hover:bg-cream-100/10">
          <CloseIcon />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-coal-800 text-ember-400"><BagIcon width={28} height={28} /></span>
          <p className="display text-2xl text-cream-50">Seu carrinho está vazio</p>
          <p className="max-w-xs text-cream-500">Escolha um hambúrguer no cardápio e ele aparece aqui.</p>
          <Button data-autofocus onClick={() => { close(); window.setTimeout(() => scrollToTarget('#cardapio'), 60) }}>Ver cardápio</Button>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-cream-100/8 overflow-y-auto overscroll-contain px-5">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3.5 py-4">
                {line.image ? (
                  <img src={line.image} alt="" width={64} height={64} loading="lazy" className="size-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span aria-hidden="true" className="size-16 shrink-0 rounded-xl bg-coal-800" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-snug text-cream-50">{line.name}</p>
                    <button type="button" onClick={() => remove(line.key)} aria-label={`Remover ${line.name}`} className="-mr-2.5 -mt-2.5 grid size-11 shrink-0 place-items-center rounded-full text-cream-500 transition-colors hover:bg-cream-100/10 hover:text-danger">
                      <TrashIcon width={17} height={17} />
                    </button>
                  </div>
                  {line.addons.length > 0 && (
                    <ul className="mt-0.5 text-sm text-cream-500">
                      {line.addons.map((a) => <li key={a.addonId}>+ {a.quantity}x {a.name}</li>)}
                    </ul>
                  )}
                  {line.note && <p className="mt-0.5 text-sm italic text-cream-500">“{line.note}”</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper label={`quantidade de ${line.name}`} value={line.quantity} min={0} onChange={(v) => setQuantity(line.key, v)} />
                    <span className="font-bold tabular-nums text-cream-50">{formatMoney(lineTotal(line))}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="shrink-0 border-t border-cream-100/10 bg-coal-900 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {missing > 0 && (
              <div className="mb-4" role="status">
                <p className="text-sm text-cream-300">Faltam <strong className="text-ember-400">{formatMoney(missing)}</strong> para o pedido mínimo de {formatMoney(deliveryConfig.minimumOrder)}.</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-coal-700" aria-hidden="true">
                  <div className="h-full origin-left rounded-full bg-ember-500 transition-transform duration-500" style={{ transform: `scaleX(${progress / 100})` }} />
                </div>
              </div>
            )}
            <dl className="space-y-1.5 text-cream-300">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums text-cream-50">{formatMoney(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Taxa de entrega</dt><dd className="text-sm text-cream-500">Calculada no próximo passo</dd></div>
            </dl>
            <Button
              full size="lg" data-autofocus
              disabled={missing > 0}
              onClick={() => setPanel('checkout')}
              className={cx('mt-4 !justify-between !px-6')}
            >
              <span className="inline-flex items-center gap-2">Finalizar pedido <ArrowIcon /></span>
              <span className="tabular-nums">{formatMoney(subtotal)}</span>
            </Button>
            <button type="button" onClick={close} className="mt-2 min-h-11 w-full text-sm font-semibold uppercase tracking-[0.12em] text-cream-300 transition-colors hover:text-cream-50">
              Adicionar mais itens
            </button>
          </footer>
        </>
      )}
    </Sheet>
  )
}
