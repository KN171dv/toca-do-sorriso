import { getCategories, getProductsByCategory } from '@/lib/catalog'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { ProductCard, ProductRow } from '@/components/menu/ProductCard'

/** Categorias exibidas com cards grandes (foto é o argumento de venda). */
const FEATURE_LAYOUT = new Set(['hamburgueres', 'combos'])

export function Menu() {
  const categories = getCategories()
  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative bg-coal-950 pb-20 pt-20 lg:pt-28">
      <div className="container-x">
        <div data-reveal className="mb-8 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Cardápio completo</p>
            <h2 id="cardapio-titulo" className="display text-[clamp(2.6rem,11vw,5.5rem)] text-cream-50">Escolha o seu.</h2>
          </div>
          <p className="max-w-sm text-cream-500">Toque em um item para personalizar com adicionais e observações.</p>
        </div>

        <CategoryTabs categories={categories} />

        {categories.map((category) => {
          const items = getProductsByCategory(category.id)
          const feature = FEATURE_LAYOUT.has(category.id)
          return (
            <section key={category.id} id={`cat-${category.id}`} aria-labelledby={`cat-${category.id}-titulo`} className="pt-10 lg:pt-14">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h3 id={`cat-${category.id}-titulo`} className="display text-[2rem] text-cream-50 lg:text-[2.6rem]">{category.name}</h3>
                <span className="text-sm tabular-nums text-cream-500">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
              </div>
              {feature ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => <ProductRow key={p.id} product={p} />)}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}
