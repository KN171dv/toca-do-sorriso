import { useEffect, useRef, useState } from 'react'
import type { Category } from '@/types'
import { cx } from '@/lib/format'
import { scrollToTarget } from '@/hooks/useLenis'

/** Abas fixas com scrollspy: mostram onde o cliente está no cardápio. */
export function CategoryTabs({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = categories.map((c) => document.getElementById(`cat-${c.id}`)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id.replace('cat-', ''))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categories])

  // Mantém a aba ativa visível na barra (scroll horizontal, sem mexer na página).
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)
    const box = bar.current
    if (!el || !box) return
    box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <div className="sticky top-16 z-20 -mx-[clamp(1rem,4vw,2.5rem)] border-y border-cream-100/10 bg-coal-950/90 backdrop-blur-md">
      <nav aria-label="Categorias do cardápio">
        <div ref={bar} className="no-scrollbar flex gap-2 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] py-2.5">
          {categories.map((c) => (
            <a
              key={c.id}
              data-tab={c.id}
              href={`#cat-${c.id}`}
              aria-current={active === c.id ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); scrollToTarget(`#cat-${c.id}`, -130) }}
              className={cx(
                'inline-flex min-h-11 shrink-0 items-center rounded-full px-5 text-sm font-bold uppercase tracking-[0.1em] transition-colors duration-200',
                active === c.id ? 'bg-ember-500 text-coal-950' : 'bg-coal-800 text-cream-300 hover:text-cream-50',
              )}
            >
              {c.name}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
