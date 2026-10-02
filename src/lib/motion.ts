import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.config({ nullTargetWarn: false })

export { gsap, ScrollTrigger }

export const EASE = { out: 'power3.out', inOut: 'power2.inOut' } as const
/** Curva padrão para transições de UI (Motion). */
export const UI_EASE = [0.22, 1, 0.36, 1] as const
