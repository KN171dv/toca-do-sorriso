import { useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useOverlay } from '@/hooks/useOverlay'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { UI_EASE } from '@/lib/motion'
import { cx } from '@/lib/format'

interface Props {
  open: boolean
  onClose: () => void
  labelledBy: string
  /** drawer: lateral no desktop · modal: central no desktop. No mobile ambos sobem de baixo. */
  variant: 'drawer' | 'modal'
  children: ReactNode
  className?: string
}

/** Base acessível para modal de produto, carrinho e checkout. */
export function Sheet({ open, onClose, labelledBy, variant, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const desktop = useMediaQuery('(min-width: 768px)')
  const reduce = usePrefersReducedMotion()
  useOverlay(open, ref, onClose)

  const hidden = reduce
    ? { opacity: 0 }
    : !desktop
      ? { y: '100%' }
      : variant === 'drawer'
        ? { x: '100%' }
        : { opacity: 0, y: 24, scale: 0.98 }
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 }

  return (
    <AnimatePresence>
      {open && (
        <div className={cx('fixed inset-0 z-50 flex', variant === 'drawer' ? 'items-end md:items-stretch md:justify-end' : 'items-end md:items-center md:justify-center md:p-6')}>
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            data-lenis-prevent
            initial={hidden} animate={shown} exit={hidden}
            transition={{ duration: reduce ? 0.01 : 0.42, ease: UI_EASE }}
            className={cx(
              'relative flex max-h-[94dvh] w-full flex-col overflow-hidden bg-coal-900 shadow-2xl outline-none',
              'rounded-t-[28px] border-t border-cream-100/10',
              variant === 'drawer'
                ? 'md:h-dvh md:max-h-none md:w-[440px] md:rounded-none md:border-l md:border-t-0'
                : 'md:max-h-[90dvh] md:rounded-[28px] md:border',
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
