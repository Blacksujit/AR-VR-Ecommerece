'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/ui/ProductImage'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useAuth } from '@/components/auth/AuthContext'

export function CartSidebar() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore()
  const { isCartOpen, toggleCart } = useUIStore()
  const { user } = useAuth()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/75"
            onClick={toggleCart}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-ink"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
              <div>
                <p className="text-xs text-muted">Your selections</p>
                <h2 className="mt-1 text-lg font-semibold">Shopping bag ({getTotalItems()})</h2>
              </div>
              <button type="button" onClick={toggleCart} className="flex h-10 w-10 items-center justify-center rounded-control text-muted transition-colors hover:bg-panel-soft hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric" aria-label="Close shopping bag">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel-soft">
                    <ShoppingBag className="h-6 w-6 text-muted" aria-hidden="true" />
                  </div>
                  <p className="mt-5 font-medium">Your bag is empty</p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted">Add an object you want to inspect more closely.</p>
                  <Link href="/products" onClick={toggleCart} className="mt-5">
                    <Button variant="secondary">Explore products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = calculateDiscountedPrice(item.product.price, item.product.discount)
                    const atLimit = item.quantity >= item.product.stock
                    return (
                      <div key={item.product._id} className="flex gap-3 border-b border-line pb-4 last:border-0">
                        <Link href={`/products/${item.product.slug}`} onClick={toggleCart} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-media border border-line bg-panel-soft" aria-label={`View ${item.product.name}`}>
                          <ProductImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link href={`/products/${item.product.slug}`} onClick={toggleCart} className="truncate text-sm font-medium hover:text-electric">{item.product.name}</Link>
                              <p className="mt-1 text-xs text-muted">{item.product.brand}</p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold">{formatPrice(price * item.quantity)}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-control border border-line bg-panel-soft p-1">
                              <button type="button" aria-label={`Decrease quantity of ${item.product.name}`} onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} className="flex h-7 w-7 items-center justify-center rounded-control text-muted hover:bg-panel hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"><Minus className="h-3 w-3" /></button>
                              <span className="w-7 text-center text-xs" aria-live="polite">{item.quantity}</span>
                              <button type="button" aria-label={`Increase quantity of ${item.product.name}`} disabled={atLimit} onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-control text-muted hover:bg-panel hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric disabled:opacity-35"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button type="button" onClick={() => removeItem(item.product._id)} className="flex min-h-8 items-center gap-1 rounded-control px-2 text-xs text-muted hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric" aria-label={`Remove ${item.product.name}`}><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line bg-panel p-5 sm:p-6">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="font-semibold">{formatPrice(getSubtotal())}</span></div>
                <p className="mt-2 text-xs text-muted">Shipping and tax are confirmed at checkout.</p>
                <Link href={user ? '/checkout' : '/sign-in?redirect=/checkout'} onClick={toggleCart} className="mt-5 block">
                  <Button className="w-full" size="lg">{user ? 'Continue to checkout' : 'Sign in to checkout'}<ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
