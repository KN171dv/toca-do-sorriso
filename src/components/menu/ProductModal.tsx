import { useEffect, useMemo, useState } from 'react'
import type { CartAddon } from '@/types'
import { getAddonsFor, getProduct } from '@/lib/catalog'
import { flyToCart } from '@/lib/flyToCart'
import { formatMoney } from '@/lib/format'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { CloseIcon } from '@/components/ui/Icons'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Sheet } from '@/components/ui/Sheet'
import { Badges } from './badges'
import { Price } from './Price'

export function ProductModal() {
  const { productId, closeProduct } = useUi()
  const add = useCart((s) => s.add)
  const [shownId, setShownId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [picked, setPicked] = useState<Record<string, number>>({})
  const [note, setNote] = useState('')

  // Mantém o último produto durante a animação de saída e zera o estado ao abrir.
  useEffect(() => {
    if (!productId) return
    setShownId(productId)
    setQuantity(1)
    setPicked({})
    setNote('')
  }, [productId])

  const product = shownId ? getProduct(shownId) : undefined
  const addons = useMemo(() => (product ? getAddonsFor(product) : []), [product])
  const addonsTotal = addons.reduce((sum, a) => sum + a.price * (picked[a.id] ?? 0), 0)
  const total = product ? (product.price + addonsTotal) * quantity : 0

  const confirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return
    flyToCart(e.currentTarget, product.image?.srcSmall ?? product.image?.src)
    const chosen: CartAddon[] = addons
      .filter((a) => (picked[a.id] ?? 0) > 0)
      .map((a) => ({ addonId: a.id, name: a.name, price: a.price, quantity: picked[a.id] }))
    add(product, quantity, chosen, note)
    closeProduct()
  }

  return (
    <Sheet open={!!productId} onClose={closeProduct} labelledBy="produto-titulo" variant="modal" className="md:w-[min(920px,100%)]">
      {product && (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <button type="button" onClick={closeProduct} aria-label="Fechar" className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-coal-950/80 text-cream-50 backdrop-blur transition-colors hover:bg-coal-700">
            <CloseIcon />
          </button>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden">
            {/* Foto inteira: quadrada, no máximo 500px (tamanho do arquivo), sem corte nem ampliação; o resto é fundo */}
            <div className="grid shrink-0 place-items-center bg-coal-950 bg-[radial-gradient(closest-side,rgb(224_102_26/0.2),transparent)] p-4 md:w-[46%] md:p-6">
              <ProductPhoto image={product.image} name={product.name} size="lg" eager sizes="(min-width: 768px) 380px, min(100vw, 40dvh)" className="aspect-square w-[min(100%,40dvh,500px)] rounded-2xl md:w-[min(100%,500px)]" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col md:overflow-y-auto md:overscroll-contain">
              <div className="p-5 md:p-7 md:pr-14">
                <Badges badges={product.badges} className="mb-3" />
                <h2 id="produto-titulo" className="display text-[2.2rem] text-cream-50 md:text-[2.8rem]">{product.name}</h2>
                {product.description && <p className="mt-3 leading-relaxed text-cream-300">{product.description}</p>}
                <Price product={product} className="mt-4 text-2xl" />
              </div>

              {addons.length > 0 && (
                <fieldset className="border-t border-cream-100/10 px-5 py-5 md:px-7">
                  <legend className="float-left mb-3 w-full">
                    <span className="display text-xl text-cream-50">Adicionais</span>
                    <span className="ml-2 text-sm text-cream-500">Opcional</span>
                  </legend>
                  <ul className="clear-both divide-y divide-cream-100/8">
                    {addons.map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="min-w-0">
                          <span className="block font-semibold text-cream-100">{a.name}</span>
                          {a.description && <span className="block text-sm text-cream-500">{a.description}</span>}
                          <span className="text-sm font-semibold tabular-nums text-ember-400">+ {formatMoney(a.price)}</span>
                        </span>
                        <QuantityStepper label={a.name} value={picked[a.id] ?? 0} max={a.max} onChange={(v) => setPicked((s) => ({ ...s, [a.id]: v }))} />
                      </li>
                    ))}
                  </ul>
                </fieldset>
              )}

              <div className="border-t border-cream-100/10 px-5 py-5 md:px-7">
                <label htmlFor="produto-obs" className="display block text-xl text-cream-50">Observações</label>
                <textarea
                  id="produto-obs" rows={2} maxLength={200} value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: sem cebola, ponto da carne, sabor do refri…"
                  className="field mt-3 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {product && (
        <div className="flex shrink-0 items-center gap-3 border-t border-cream-100/10 bg-coal-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-7">
          <QuantityStepper label="quantidade" value={quantity} min={1} onChange={setQuantity} />
          <Button full size="lg" onClick={confirm} data-autofocus className="!justify-between !px-6">
            <span>Adicionar</span>
            <span className="tabular-nums">{formatMoney(total)}</span>
          </Button>
        </div>
      )}
    </Sheet>
  )
}
