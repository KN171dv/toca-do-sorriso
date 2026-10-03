import { MinusIcon, PlusIcon } from './Icons'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
}

/** Controle − / + com alvos de toque ≥ 44px. */
export function QuantityStepper({ value, onChange, min = 0, max = 99, label }: Props) {
  const btn =
    'grid size-11 place-items-center rounded-full text-cream-50 transition-[background-color,scale] duration-150 hover:bg-cream-100/10 active:scale-95 disabled:opacity-30'
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-coal-600 bg-coal-900">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Diminuir ${label}`}>
        <MinusIcon width={16} height={16} />
      </button>
      <span aria-live="polite" className="min-w-7 text-center text-base font-bold tabular-nums">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Aumentar ${label}`}>
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  )
}
