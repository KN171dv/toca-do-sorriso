import { useMemo } from 'react'

/** Fagulhas de brasa: só CSS (transform/opacity), sem JS por frame. */
export function Embers({ count = 14 }: { count?: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2)
        return {
          left: `${4 + r(1) * 92}%`,
          size: 2 + r(2) * 3,
          delay: `${-r(3) * 9}s`,
          duration: `${7 + r(4) * 7}s`,
          drift: `${(r(5) - 0.5) * 120}px`,
        }
      }),
    [count],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="absolute bottom-[-10px] animate-rise rounded-full bg-ember-400 shadow-[0_0_8px_2px_rgb(245_138_42/0.7)]"
          style={{ left: s.left, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration, ['--drift' as string]: s.drift }}
        />
      ))}
    </div>
  )
}
