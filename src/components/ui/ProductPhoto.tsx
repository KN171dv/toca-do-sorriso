import { useState } from 'react'
import type { ProductImage } from '@/types'
import { cx } from '@/lib/format'
import { FlameIcon } from './Icons'

interface Props {
  image?: ProductImage
  name: string
  size?: 'sm' | 'lg'
  className?: string
  eager?: boolean
  sizes?: string
}

/**
 * Foto do produto com lazy-loading e srcset. Sem foto (ou se falhar), mostra
 * um placeholder identificado — nunca uma imagem genérica.
 */
export function ProductPhoto({ image, name, size = 'sm', className, eager, sizes }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!image || failed) {
    return (
      <div
        role="img"
        aria-label={`${name} — foto em breve`}
        className={cx('grid place-items-center bg-coal-800 text-cream-500/45', className)}
      >
        <div className="flex flex-col items-center gap-1.5 p-2 text-center">
          <FlameIcon width={size === 'lg' ? 40 : 24} height={size === 'lg' ? 40 : 24} />
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream-500">Foto em breve</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cx('overflow-hidden bg-coal-800', className)}>
      <img
        src={size === 'lg' ? image.src : (image.srcSmall ?? image.src)}
        srcSet={image.srcSmall ? `${image.srcSmall} 320w, ${image.src} 500w` : undefined}
        sizes={sizes ?? (size === 'lg' ? '(min-width: 768px) 520px, 100vw' : '160px')}
        alt={image.alt}
        width={500}
        height={500}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cx('size-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
