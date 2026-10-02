import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/format'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition-[translate,scale,background-color,box-shadow,border-color] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-ember-500 text-coal-950 shadow-ember hover:bg-ember-400',
  outline: 'border border-cream-100/30 text-cream-50 hover:border-cream-100/70 hover:bg-cream-100/5',
  ghost: 'text-cream-100 hover:bg-cream-100/10',
}
const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 text-[0.86rem]',
  lg: 'min-h-14 px-8 text-[0.95rem]',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', full = false): string =>
  cx(base, variants[variant], sizes[size], full && 'w-full')

export function Button({ variant = 'primary', size = 'md', full, className, children, type = 'button', ...rest }: Props) {
  return (
    <button type={type} className={cx(buttonClass(variant, size, full), className)} {...rest}>
      {children}
    </button>
  )
}
