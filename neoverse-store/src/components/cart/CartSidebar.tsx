'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useAuth } from '@/components/auth/AuthContext'
import Link from 'next/link'

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 glass border-l border-white/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Cart ({getTotalItems()})</h2>
                </div>
                <button onClick={toggleCart} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40">Your cart is empty</p>
                    <Button variant="glass" className="mt-4" onClick={toggleCart}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product._id} className="glass rounded-xl p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-purple/20 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-white/40 mt-1">{item.product.brand}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount))}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-md hover:bg-white/10"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-white/10"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="p-1 rounded-md hover:bg-white/10 ml-auto text-error/60 hover:text-error"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/10 p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-semibold">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="text-white/40">Calculated at checkout</span>
                  </div>
                  <Link href={user ? '/checkout' : '#'} className="block">
                    <Button className="w-full" size="lg">
                      Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
