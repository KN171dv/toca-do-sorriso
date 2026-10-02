import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import type { Order } from '@/types'
import { deliveryConfig, deliveryZones } from '@/data/delivery'
import { businessInfo, fullAddress } from '@/data/business'
import { paymentMethods } from '@/data/payments'
import { cx, formatMoney, maskPhone } from '@/lib/format'
import { newOrderId, orderGateway } from '@/lib/orderService'
import { computeTotals, deliveryFeeFor } from '@/lib/pricing'
import { validateCheckout, type CheckoutErrors } from '@/lib/validation'
import { useStoreStatus } from '@/hooks/useStoreStatus'
import { useCart } from '@/store/cart'
import { useCheckout, useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { BackIcon, CheckIcon, CloseIcon, MotoIcon, StoreIcon, WhatsappIcon } from '@/components/ui/Icons'
import { Sheet } from '@/components/ui/Sheet'

function Field({ label, error, optional, children, className }: { label: string; error?: string; optional?: boolean; className?: string; children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-cream-100">
        {label} {optional && <span className="font-normal text-cream-500">(opcional)</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-erro` : undefined })}
      {error && <p id={`${id}-erro`} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

export function CheckoutSheet() {
  const { panel, setPanel } = useUi()
  const { lines, clear } = useCart()
  const { mode, customer, setMode, update } = useCheckout()
  const status = useStoreStatus()
  const form = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<{ order: Order; url?: string } | null>(null)

  const fee = deliveryFeeFor(mode, customer.zoneId)
  const totals = computeTotals(lines, mode, customer.zoneId)
  const payment = paymentMethods.find((p) => p.id === customer.paymentId)
  const open = panel === 'checkout' || panel === 'success'

  const close = () => {
    setPanel('none')
    if (panel === 'success') setSent(null)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateCheckout(customer, mode, totals.total)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSending(true)
    const order: Order = { id: newOrderId(), createdAt: new Date().toISOString(), mode, lines, customer, totals }
    const result = await orderGateway.submit(order)
    setSending(false)
    if (!result.ok) { setErrors({ notes: result.error }); return }
    if (result.redirectUrl) window.open(result.redirectUrl, '_blank', 'noopener')
    setSent({ order, url: result.redirectUrl })
    clear()
    setPanel('success')
  }

  const modes = [
    { id: 'delivery' as const, label: 'Entrega', icon: <MotoIcon />, enabled: deliveryConfig.modes.delivery },
    { id: 'pickup' as const, label: 'Retirada', icon: <StoreIcon />, enabled: deliveryConfig.modes.pickup },
  ].filter((m) => m.enabled)

  return (
    <Sheet open={open} onClose={close} labelledBy="checkout-titulo" variant="drawer" className="h-[94dvh] md:h-dvh md:!w-[480px]">
      {panel === 'success' && sent ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-ok/15 text-ok"><CheckIcon width={30} height={30} /></span>
          <h2 id="checkout-titulo" className="display text-3xl text-cream-50">Pedido {sent.order.id} montado!</h2>
          <p className="max-w-sm text-cream-300">
            Abrimos o WhatsApp da Toca com o seu pedido pronto. <strong className="text-cream-50">Toque em enviar na conversa</strong> para confirmar — a loja responde por lá.
          </p>
          {!status.isOpen && <p className="max-w-sm text-sm text-cream-500">Estamos fechados agora ({status.label.toLowerCase()}). Seu pedido será respondido assim que abrirmos.</p>}
          {sent.url && (
            <a href={sent.url} target="_blank" rel="noopener noreferrer" data-autofocus className="mt-2 inline-flex min-h-14 items-center gap-2 rounded-full bg-ember-500 px-8 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-coal-950 shadow-ember transition-colors hover:bg-ember-400">
              <WhatsappIcon /> Abrir WhatsApp de novo
            </a>
          )}
          <button type="button" onClick={close} className="min-h-11 text-sm font-semibold uppercase tracking-[0.12em] text-cream-300 hover:text-cream-50">Voltar ao site</button>
        </div>
      ) : (
        <>
          <header className="flex shrink-0 items-center gap-2 border-b border-cream-100/10 px-3 py-4">
            <button type="button" onClick={() => setPanel('cart')} aria-label="Voltar ao carrinho" className="grid size-11 place-items-center rounded-full text-cream-100 transition-colors hover:bg-cream-100/10"><BackIcon /></button>
            <h2 id="checkout-titulo" className="display flex-1 text-2xl text-cream-50">Finalizar pedido</h2>
            <button type="button" onClick={close} aria-label="Fechar" className="grid size-11 place-items-center rounded-full text-cream-100 transition-colors hover:bg-cream-100/10"><CloseIcon /></button>
          </header>

          <form ref={form} onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-5">
              {!status.isOpen && (
                <p role="status" className="rounded-2xl border border-ember-500/30 bg-ember-500/10 p-3.5 text-sm text-cream-100">
                  Estamos fechados agora — <strong>{status.label.toLowerCase()}</strong>. Você pode enviar o pedido e ele será respondido quando abrirmos.
                </p>
              )}

              <fieldset>
                <legend className="display mb-3 text-xl text-cream-50">Como você quer receber?</legend>
                <div className="grid grid-cols-2 gap-2 rounded-full bg-coal-800 p-1">
                  {modes.map((m) => (
                    <label key={m.id} className={cx('relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-[0.08em] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember-400', mode === m.id ? 'bg-ember-500 text-coal-950' : 'text-cream-300')}>
                      <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="sr-only" />
                      {m.icon} {m.label}
                    </label>
                  ))}
                </div>
                {mode === 'pickup' && (
                  <p className="mt-3 rounded-2xl bg-coal-800 p-3.5 text-sm text-cream-300">
                    Retire em: <strong className="text-cream-50">{fullAddress()}</strong>
                    <span className="block text-cream-500">{businessInfo.address.reference} · ~{deliveryConfig.estimatedMinutes.pickup} min</span>
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="display mb-3 text-xl text-cream-50">Seus dados</legend>
                <Field label="Nome" error={errors.name}>
                  {(p) => <input {...p} name="name" data-autofocus className="field" autoComplete="name" value={customer.name} onChange={(e) => update({ name: e.target.value })} />}
                </Field>
                <Field label="Telefone / WhatsApp" error={errors.phone}>
                  {(p) => <input {...p} name="phone" className="field" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(21) 99999-9999" value={customer.phone} onChange={(e) => update({ phone: maskPhone(e.target.value) })} />}
                </Field>
              </fieldset>

              {mode === 'delivery' && (
                <fieldset className="space-y-4">
                  <legend className="display mb-3 text-xl text-cream-50">Endereço de entrega</legend>
                  <Field label="Bairro" error={errors.zoneId}>
                    {(p) => (
                      <select {...p} name="zoneId" className="field appearance-none" value={customer.zoneId} onChange={(e) => update({ zoneId: e.target.value })}>
                        <option value="">Selecione o bairro…</option>
                        {deliveryZones.map((z) => <option key={z.id} value={z.id}>{z.name} — {formatMoney(z.fee)}</option>)}
                      </select>
                    )}
                  </Field>
                  <div className="grid grid-cols-[1fr_7rem] gap-3">
                    <Field label="Endereço" error={errors.street}>
                      {(p) => <input {...p} name="street" className="field" autoComplete="address-line1" placeholder="Rua, avenida…" value={customer.street} onChange={(e) => update({ street: e.target.value })} />}
                    </Field>
                    <Field label="Número" error={errors.number}>
                      {(p) => <input {...p} name="number" className="field" inputMode="numeric" value={customer.number} onChange={(e) => update({ number: e.target.value })} />}
                    </Field>
                  </div>
                  <Field label="Complemento" optional>
                    {(p) => <input {...p} name="complement" className="field" autoComplete="address-line2" placeholder="Apto, bloco, casa…" value={customer.complement} onChange={(e) => update({ complement: e.target.value })} />}
                  </Field>
                  <Field label="Ponto de referência" optional>
                    {(p) => <input {...p} name="reference" className="field" value={customer.reference} onChange={(e) => update({ reference: e.target.value })} />}
                  </Field>
                </fieldset>
              )}

              <fieldset>
                <legend className="display mb-3 text-xl text-cream-50">Pagamento {mode === 'delivery' ? 'na entrega' : 'na retirada'}</legend>
                <div className="space-y-2" role="radiogroup" aria-invalid={!!errors.paymentId}>
                  {paymentMethods.filter((p) => p.active).map((p) => (
                    <label key={p.id} className={cx('relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember-400', customer.paymentId === p.id ? 'border-ember-500 bg-ember-500/10' : 'border-coal-600 bg-coal-900')}>
                      <input type="radio" name="paymentId" value={p.id} checked={customer.paymentId === p.id} onChange={() => update({ paymentId: p.id })} className="sr-only" />
                      <span aria-hidden="true" className={cx('grid size-5 shrink-0 place-items-center rounded-full border-2', customer.paymentId === p.id ? 'border-ember-500' : 'border-cream-500')}>
                        {customer.paymentId === p.id && <span className="size-2.5 rounded-full bg-ember-500" />}
                      </span>
                      <span>
                        <span className="block font-semibold text-cream-50">{p.name}</span>
                        {p.hint && <span className="block text-sm text-cream-500">{p.hint}</span>}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.paymentId && <p role="alert" className="mt-1.5 text-sm text-danger">{errors.paymentId}</p>}
                {payment?.asksChange && (
                  <Field label="Troco para quanto?" optional error={errors.changeFor} className="mt-4">
                    {(p) => <input {...p} name="changeFor" className="field" inputMode="decimal" placeholder="Ex.: 100,00 — deixe vazio se não precisa" value={customer.changeFor} onChange={(e) => update({ changeFor: e.target.value })} />}
                  </Field>
                )}
              </fieldset>

              <Field label="Observações do pedido" optional error={errors.notes}>
                {(p) => <textarea {...p} name="notes" rows={2} maxLength={300} className="field resize-none" value={customer.notes} onChange={(e) => update({ notes: e.target.value })} />}
              </Field>
            </div>

            <footer className="shrink-0 border-t border-cream-100/10 bg-coal-900 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <dl className="space-y-1 text-cream-300">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatMoney(totals.subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt>{mode === 'delivery' ? 'Taxa de entrega' : 'Retirada no local'}</dt>
                  <dd className="tabular-nums">{fee === null ? <span className="text-sm text-cream-500">Selecione o bairro</span> : fee === 0 ? 'Grátis' : formatMoney(fee)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-lg font-bold text-cream-50"><dt>Total</dt><dd className="tabular-nums" aria-live="polite">{formatMoney(totals.total)}</dd></div>
              </dl>
              <Button type="submit" full size="lg" disabled={sending || lines.length === 0} className="mt-4">
                <WhatsappIcon /> {sending ? 'Enviando…' : 'Enviar pedido pelo WhatsApp'}
              </Button>
            </footer>
          </form>
        </>
      )}
    </Sheet>
  )
}
