import { getCategories, getProductsByCategory } from '@/lib/catalog'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { ProductCard, ProductRow } from '@/components/menu/ProductCard'

/** Categorias exibidas com cards grandes (foto é o argumento de venda). */
const FEATURE_LAYOUT = new Set(['hamburgueres', 'combos'])

export function Menu() {
  const categories = getCategories()
  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative isolate bg-coal-950 pb-24 pt-10 lg:pb-32 lg:pt-14">
      <div className="container-x">
        {/* Título funcional: aqui o que importa são os produtos */}
        <div className="mb-5 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <h2 data-reveal id="cardapio-titulo" className="display text-[clamp(1.9rem,6vw,2.6rem)] text-cream-50">Cardápio</h2>
          <p data-reveal className="max-w-sm text-sm text-cream-500 sm:text-right">Toque em um item para personalizar com adicionais e observações.</p>
        </div>

        <CategoryTabs categories={categories} />

        {categories.map((category) => {
          const items = getProductsByCategory(category.id)
          const feature = FEATURE_LAYOUT.has(category.id)
          return (
            <section key={category.id} id={`cat-${category.id}`} aria-labelledby={`cat-${category.id}-titulo`} className="pt-9 lg:pt-12">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h3 id={`cat-${category.id}-titulo`} className="display text-[1.6rem] text-cream-50 lg:text-[2rem]">{category.name}</h3>
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
