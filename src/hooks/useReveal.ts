import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

/**
 * Revela elementos marcados com [data-reveal] ao entrarem na tela
 * (opacity/transform apenas). Com redução de movimento, nada é escondido.
 */
export function useReveal(): void {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      gsap.set(items, { opacity: 0, y: 28 }) // só opacity: itens continuam focáveis pelo teclado
      const triggers = ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          // Quem já ficou acima da tela (salto por âncora) aparece na hora;
          // só o que está visível entra com a animação escalonada.
          const els = batch as HTMLElement[]
          const passed = els.filter((el) => el.getBoundingClientRect().bottom < 0)
          const visible = els.filter((el) => !passed.includes(el))
          gsap.set(passed, { opacity: 1, y: 0, clearProps: 'transform' })
          gsap.to(visible, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, overwrite: true, clearProps: 'transform' })
        },
      })
      return () => triggers.forEach((t) => t.kill())
    })
    return () => mm.revert()
  }, [])
}
