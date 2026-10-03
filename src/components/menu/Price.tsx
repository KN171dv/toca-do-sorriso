import type { Product } from '@/types'
import { cx } from '@/lib/format'
import { Money } from '@/components/ui/Money'

export function Price({ product, className }: { product: Pick<Product, 'price' | 'compareAtPrice'>; className?: string }) {
  return (
    <span className={cx('inline-flex items-baseline gap-2 font-bold tabular-nums text-cream-50', className)}>
      {product.compareAtPrice && (
        <s className="text-[0.82em] font-medium text-cream-500">
          <span className="sr-only">De </span><Money value={product.compareAtPrice} />
        </s>
      )}
      <span>{product.compareAtPrice && <span className="sr-only">por </span>}<Money value={product.price} /></span>
    </span>
  )
}
