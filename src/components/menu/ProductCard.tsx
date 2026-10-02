import type { Product } from '@/types'
import { useUi } from '@/store/ui'
import { PlusIcon } from '@/components/ui/Icons'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { Badges } from './badges'
import { Price } from './Price'
import { useAddProduct } from './useAddProduct'

const addBtn =
  'grid size-11 shrink-0 place-items-center rounded-full bg-ember-500 text-coal-950 shadow-ember transition-transform duration-150 hover:bg-ember-400 active:scale-90'

/** Card com foto grande — hambúrgueres e combos. */
export function ProductCard({ product }: { product: Product }) {
  const openProduct = useUi((s) => s.openProduct)
  const addProduct = useAddProduct()
  return (
    <article data-reveal className="group relative flex flex-col overflow-hidden rounded-3xl border border-cream-100/8 bg-coal-900 transition-colors duration-300 hover:border-ember-500/50">
      <div className="relative">
        <ProductPhoto image={product.image} name={product.name} sizes="(min-width:1024px) 290px, (min-width:640px) 33vw, 50vw" className="aspect-square w-full [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.06]" />
        <Badges badges={product.badges} className="absolute left-2.5 top-2.5" />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="display text-[1.3rem] leading-none text-cream-50 sm:text-2xl">
          <button type="button" onClick={() => openProduct(product.id)} className="text-left uppercase after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ember-400">
            {product.name}
          </button>
        </h3>
        <p className="mt-2 line-clamp-2 hidden text-sm leading-snug text-cream-500 sm:block">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price product={product} className="flex-col !items-start !gap-0 text-[1.05rem] sm:text-lg" />
          <button type="button" onClick={() => addProduct(product)} aria-label={`Adicionar ${product.name}`} className={`relative z-10 ${addBtn}`}>
            <PlusIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

/** Linha compacta — porções, bebidas e pratos. */
export function ProductRow({ product }: { product: Product }) {
  const openProduct = useUi((s) => s.openProduct)
  const addProduct = useAddProduct()
  return (
    <article data-reveal className="group relative flex items-center gap-3.5 rounded-2xl border border-cream-100/8 bg-coal-900 p-2.5 pr-3.5 transition-colors duration-300 hover:border-ember-500/50">
      <ProductPhoto image={product.image} name={product.name} sizes="80px" className="size-20 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Badges badges={product.badges} className="mb-1" />
        <h3 className="text-[1.02rem] font-semibold leading-snug text-cream-50">
          <button type="button" onClick={() => openProduct(product.id)} className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ember-400">
            {product.name}
          </button>
        </h3>
        {product.description && <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-cream-500">{product.description}</p>}
        <Price product={product} className="mt-1 text-[1.02rem]" />
      </div>
      <button type="button" onClick={() => addProduct(product)} aria-label={`Adicionar ${product.name}`} className={`relative z-10 ${addBtn}`}>
        <PlusIcon />
      </button>
    </article>
  )
}
