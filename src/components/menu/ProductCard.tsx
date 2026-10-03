import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { cx } from '@/lib/format'
import { useUi } from '@/store/ui'
import { CheckIcon, PlusIcon } from '@/components/ui/Icons'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { Badges } from './badges'
import { Price } from './Price'
import { useAddProduct } from './useAddProduct'

/** "+" com confirmação: vira um check por 1,2 s quando o item entra direto no carrinho. */
function AddButton({ product }: { product: Product }) {
  const addProduct = useAddProduct()
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => setDone(false), 1200)
    return () => window.clearTimeout(id)
  }, [done])
  return (
    <button
      type="button"
      onClick={(e) => { if (addProduct(product, e.currentTarget)) setDone(true) }}
      aria-label={`Adicionar ${product.name}`}
      className={cx(
        'relative z-10 grid size-11 shrink-0 place-items-center rounded-full text-coal-950 transition-[translate,scale,background-color] duration-200 ease-out hover:-translate-y-px active:scale-90',
        done ? 'bg-ok' : 'bg-ember-500 hover:bg-ember-400',
      )}
    >
      <span key={String(done)} className="animate-[pop_.35s_var(--ease-out-expo)]">{done ? <CheckIcon /> : <PlusIcon />}</span>
    </button>
  )
}

/** Card com foto grande — hambúrgueres e combos. */
export function ProductCard({ product }: { product: Product }) {
  const openProduct = useUi((s) => s.openProduct)
  return (
    <article data-reveal className="group relative flex flex-col overflow-hidden rounded-2xl bg-coal-900 transition-[background-color,translate] duration-300 ease-out hover:-translate-y-1 hover:bg-coal-800">
      <div className="relative">
        <ProductPhoto image={product.image} name={product.name} sizes="(min-width:1024px) 290px, (min-width:640px) 33vw, 50vw" className="aspect-square w-full [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.06]" />
        <Badges badges={product.badges} className="absolute left-2.5 top-2.5" />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="display text-[1.3rem] leading-none text-cream-50 sm:text-2xl">
          <button type="button" onClick={() => openProduct(product.id)} className="text-left uppercase after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ember-400">
            {product.name}
          </button>
        </h3>
        <p className="mt-2 line-clamp-2 hidden text-sm leading-snug text-cream-500 sm:block">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price product={product} className="flex-col !items-start !gap-0 text-[1.05rem] sm:text-lg" />
          <AddButton product={product} />
        </div>
      </div>
    </article>
  )
}

/** Linha compacta — porções, bebidas e pratos. */
export function ProductRow({ product }: { product: Product }) {
  const openProduct = useUi((s) => s.openProduct)
  return (
    <article data-reveal className="group relative flex items-center gap-3.5 rounded-xl bg-coal-900 p-2.5 pr-3.5 transition-[background-color,translate] duration-300 ease-out hover:-translate-y-1 hover:bg-coal-800">
      <ProductPhoto image={product.image} name={product.name} sizes="80px" className="size-20 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <Badges badges={product.badges} className="mb-1" />
        <h3 className="text-[1.02rem] font-semibold leading-snug text-cream-50">
          <button type="button" onClick={() => openProduct(product.id)} className="text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ember-400">
            {product.name}
          </button>
        </h3>
        {product.description && <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-cream-500">{product.description}</p>}
        <Price product={product} className="mt-1 text-[1.02rem]" />
      </div>
      <AddButton product={product} />
    </article>
  )
}
