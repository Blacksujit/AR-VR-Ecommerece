'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart-store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthContext'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, clearCart } = useCartStore()
  const { user } = useAuth()
  const router = useRouter()

  const shipping = getSubtotal() > 100 ? 0 : 9.99
  const total = getSubtotal() + shipping

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-white/40 mt-1">{getTotalItems()} items in your cart</p>
          </div>
          <div className="flex gap-3">
            {items.length > 0 && (
              <Button variant="ghost" className="text-error hover:text-error hover:bg-error/10" onClick={clearCart}>
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
            <Link href="/products">
              <Button variant="glass">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <ShoppingBag className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-white/40 mb-6">Add some products to get started</p>
            <Link href="/products">
              <Button variant="primary" size="lg">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-4">
              {items.map((item, i) => {
                const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount)
                return (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-4 flex gap-4 hover:border-primary/30 transition-all">
                      <Link href={`/products/${item.product.slug}`} className="shrink-0">
                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center">
                          {item.product.images[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-2xl font-bold text-white/20">{item.product.name.charAt(0)}</span>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">{item.product.name}</h3>
                            </Link>
                            <p className="text-xs text-white/40">{item.product.brand}</p>
                          </div>
                          <p className="text-lg font-bold text-primary">{formatPrice(discountedPrice * item.quantity)}</p>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn('w-3 h-3', i < Math.floor(item.product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 glass rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-sm text-white/40">
                              {formatPrice(discountedPrice)} each
                            </span>
                          </div>
                          <button onClick={() => removeItem(item.product._id)} className="p-2 rounded-lg hover:bg-error/10 text-error/60 hover:text-error transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <div className="lg:sticky lg:top-28 h-fit">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal ({getTotalItems()} items)</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shipping</span>
                    <span className={cn(getSubtotal() > 100 ? 'text-green-400' : 'text-white/60')}>
                      {getSubtotal() > 100 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {getSubtotal() < 100 && (
                    <p className="text-xs text-white/30">
                      Add {formatPrice(100 - getSubtotal())} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push(user ? '/checkout' : '/')}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {!user && (
                  <p className="text-xs text-white/30 text-center">You will need to sign in to checkout</p>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
