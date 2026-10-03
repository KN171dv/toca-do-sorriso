import { useMemo } from 'react'

/**
 * Fagulhas de brasa: só CSS (transform/opacity), sem JS por frame.
 * Poucas e variadas: a maioria pequena e rápida; algumas maiores, lentas,
 * desfocadas e mais apagadas (profundidade), para parecer brasa e não confete.
 */
export function Embers({ count = 9 }: { count?: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => (Math.sin(i * 9301 + n * 49297) + 1) / 2
        const big = r(6) > 0.78 // ~1 em 5 é "de perto": maior, lenta e desfocada
        const size = big ? 4 + r(2) * 3 : 1.5 + r(2) * r(2) * 2.5
        return {
          left: `${4 + r(1) * 92}%`,
          size,
          blur: big ? 1.5 : 0,
          opacity: big ? 0.45 : 0.55 + r(7) * 0.45,
          delay: `${-r(3) * 14}s`,
          duration: `${big ? 13 + r(4) * 6 : 6 + r(4) * 6}s`,
          drift: `${(r(5) - 0.5) * (big ? 60 : 140)}px`,
        }
      }),
    [count],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s, i) => (
        <span key={i} className="absolute bottom-[-10px]" style={{ left: s.left, opacity: s.opacity, filter: s.blur ? `blur(${s.blur}px)` : undefined }}>
          <span
            className="block animate-rise rounded-full bg-ember-400 shadow-[0_0_8px_2px_rgb(245_138_42/0.6)]"
            style={{ width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration, ['--drift' as string]: s.drift }}
          />
        </span>
      ))}
    </div>
  )
}
