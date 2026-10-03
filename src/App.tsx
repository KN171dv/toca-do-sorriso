import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileCartBar } from '@/components/layout/MobileCartBar'
import { CartAnnouncer } from '@/components/ui/CartAnnouncer'
import { BestSellers } from '@/components/sections/BestSellers'
import { BurgerExploded } from '@/components/sections/BurgerExploded'
import { Delivery } from '@/components/sections/Delivery'
import { Experience } from '@/components/sections/Experience'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { Instagram } from '@/components/sections/Instagram'
import { Menu } from '@/components/sections/Menu'
import { getLenis, useLenis } from '@/hooks/useLenis'
import { ScrollTrigger } from '@/lib/motion'
import { useReveal } from '@/hooks/useReveal'
import { useCart } from '@/store/cart'
import { useCheckout } from '@/store/ui'

// Modal, carrinho e checkout (e a lib Motion que os anima) ficam fora do
// bundle inicial; são baixados em segundo plano logo após o primeiro render.
const loadProductModal = () => import('@/components/menu/ProductModal')
const loadCart = () => import('@/components/cart/CartDrawer')
const loadCheckout = () => import('@/components/checkout/CheckoutSheet')
const ProductModal = lazy(() => loadProductModal().then((m) => ({ default: m.ProductModal })))
const CartDrawer = lazy(() => loadCart().then((m) => ({ default: m.CartDrawer })))
const CheckoutSheet = lazy(() => loadCheckout().then((m) => ({ default: m.CheckoutSheet })))

export default function App() {
  useLenis()
  useReveal()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // F5: garante o topo depois da hidratação (o script do <head> já tirou a âncora)
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type === 'reload') {
      window.scrollTo(0, 0)
      getLenis()?.scrollTo(0, { immediate: true })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    // Carrinho e dados salvos entram depois da hidratação (HTML estático = carrinho vazio).
    void useCart.persist.rehydrate()
    void useCheckout.persist.rehydrate()
    const warm = () => { void loadProductModal(); void loadCart(); void loadCheckout() }
    const id = window.setTimeout(warm, 2500)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BurgerExploded />
        <BestSellers />
        <Menu />
        <Experience />
        <Delivery />
        <Instagram />
        <FinalCta />
      </main>
      <Footer />
      <MobileCartBar />
      <CartAnnouncer />
      {mounted && (
        <Suspense fallback={null}>
          <ProductModal />
          <CartDrawer />
          <CheckoutSheet />
        </Suspense>
      )}
    </>
  )
}
