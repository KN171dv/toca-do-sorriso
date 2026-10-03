import { cx, formatMoney } from '@/lib/format'

/**
 * Valor em reais com o mesmo acabamento em todo o site: algarismos tabulares e
 * "R$" um pouco menor que o número. O texto lido continua "R$ 29,99".
 */
export function Money({ value, className }: { value: number; className?: string }) {
  const [symbol, ...rest] = formatMoney(value).split(/\s/)
  return (
    <span className={cx('whitespace-nowrap tabular-nums', className)}>
      <span className="mr-[0.18em] text-[0.7em] font-semibold tracking-normal">{symbol}</span>
      {rest.join(' ')}
    </span>
  )
}
