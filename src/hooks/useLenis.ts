import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/motion'

let instance: Lenis | null = null
export const getLenis = (): Lenis | null => instance

/** Rola até um seletor/elemento respeitando o Lenis (ou nativo, se desligado). */
export function scrollToTarget(target: string | HTMLElement, offset = -72): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (instance) instance.scrollTo(el, { offset, duration: 1.1 })
  else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? 'auto' : 'smooth' })
  }
}

/**
 * Scroll suave só onde agrega: ponteiro fino (desktop) e sem redução de
 * movimento. No toque, o scroll nativo é mais responsivo.
 * Lenis roda no ticker do GSAP e atualiza o ScrollTrigger (sem descompasso).
 */
export function useLenis(): void {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    instance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
}
