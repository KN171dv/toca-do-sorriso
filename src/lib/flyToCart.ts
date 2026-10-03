/**
 * Miniatura do produto voando do botão até o carrinho do cabeçalho (≤ 550 ms).
 * Só transform/opacity (Web Animations API); posições lidas uma vez, fora do loop.
 * Com movimento reduzido, não faz nada — o pulso no contador e o aviso bastam.
 */
export function flyToCart(from: Element | null, image?: string): void {
  if (!from || !image || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const target = document.querySelector('[data-cart-target]')
  if (!target) return
  const a = from.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const size = 56
  const img = document.createElement('img')
  img.src = image
  img.alt = ''
  img.setAttribute('aria-hidden', 'true')
  Object.assign(img.style, {
    position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, borderRadius: '9999px', objectFit: 'cover', zIndex: '60',
    pointerEvents: 'none', boxShadow: '0 10px 30px -8px rgb(0 0 0 / 0.7)', willChange: 'transform, opacity',
  })
  document.body.appendChild(img)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  img.animate(
    [
      { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
      { transform: `translate(${dx * 0.12}px, ${dy * 0.12 - 24}px) scale(1)`, opacity: 1, offset: 0.2 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.9 },
    ],
    { duration: 550, easing: 'cubic-bezier(0.55, 0, 0.25, 1)' },
  ).onfinish = () => img.remove()
}
