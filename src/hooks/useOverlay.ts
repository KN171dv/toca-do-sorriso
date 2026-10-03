import { useEffect, useRef, type RefObject } from 'react'
import { getLenis } from './useLenis'

let locks = 0

/**
 * Comportamento comum de modal/drawer: trava o scroll da página, fecha com
 * Esc, prende o foco dentro do painel e devolve o foco ao fechar.
 *
 * `onClose` fica numa ref: o efeito depende só de `open`. Se dependesse da
 * função (recriada a cada render), cada tecla digitada num campo do painel
 * reexecutaria o efeito e o foco voltaria para o [data-autofocus].
 */
export function useOverlay(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void): void {
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose })
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    locks += 1
    document.documentElement.classList.add('overlay-open')
    getLenis()?.stop()

    const panel = ref.current
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])') ?? [])
        .filter((el) => el.offsetParent !== null)
    window.setTimeout(() => (panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel)?.focus({ preventScroll: true }), 30)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); return }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      locks -= 1
      if (locks === 0) {
        document.documentElement.classList.remove('overlay-open')
        getLenis()?.start()
      }
      previous?.focus?.({ preventScroll: true })
    }
  }, [open, ref])
}
