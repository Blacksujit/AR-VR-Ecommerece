'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { useCartStore } from '@/store/cart-store'
import { Card } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthContext'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Star, PackageCheck } from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { ProductImage } from '@/components/ui/ProductImage'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, clearCart } = useCartStore()
  const { user } = useAuth()
  const router = useRouter()

  const shipping = getSubtotal() > 100 ? 0 : 9.99
  const total = getSubtotal() + shipping

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted">Your selections</p>
            <h1 className="mt-2 text-3xl font-display font-semibold tracking-tight sm:text-4xl">Shopping bag</h1>
            <p className="mt-2 text-sm text-muted">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} ready for review.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {items.length > 0 && (
              <Button variant="ghost" className="text-error hover:bg-error/10" onClick={clearCart}>
                <Trash2 className="w-4 h-4" />
                Clear bag
              </Button>
            )}
            <Link href="/products">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4" />
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-xl py-28 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-line bg-panel-soft">
              <ShoppingBag className="h-7 w-7 text-muted" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">Your bag is empty</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">Explore the collection and keep the objects you want to inspect or bring home in one place.</p>
            <Link href="/products" className="mt-7 inline-flex">
              <Button size="lg">Explore products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-3">
              {items.map((item) => {
                const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount)
                const atLimit = item.quantity >= item.product.stock
                return (
                  <Card key={item.product._id} className="p-4 sm:p-5">
                    <div className="flex gap-4 sm:gap-5">
                      <Link href={`/products/${item.product.slug}`} className="shrink-0" aria-label={`View ${item.product.name}`}>
                        <div className="relative h-24 w-24 overflow-hidden rounded-media border border-line bg-panel-soft sm:h-32 sm:w-32">
                          {item.product.images[0] ? (
                            <ProductImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="(max-width: 640px) 96px, 128px" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-3xl font-display text-muted" aria-label="Product image unavailable">{item.product.name.charAt(0)}</div>
                          )}
                        </div>
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/products/${item.product.slug}`} className="group">
                              <h2 className="truncate font-semibold group-hover:text-electric">{item.product.name}</h2>
                            </Link>
                            <p className="mt-1 text-xs text-muted">{item.product.brand}</p>
                          </div>
                          <p className="shrink-0 text-base font-semibold text-paper">{formatPrice(discountedPrice * item.quantity)}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-muted" aria-label={`${item.product.rating} out of 5 stars`}>
                          <span className="flex items-center gap-0.5" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={cn('h-3 w-3', index < Math.floor(item.product.rating) ? 'fill-accent text-accent' : 'text-line')} />
                            ))}
                          </span>
                          <span>{item.product.rating.toFixed(1)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatPrice(discountedPrice)} each</span>
                        </div>

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center rounded-control border border-line bg-panel-soft p-1">
                              <button type="button" aria-label={`Decrease quantity of ${item.product.name}`} onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} className="flex h-8 w-8 items-center justify-center rounded-control text-muted transition-colors hover:bg-panel hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-9 text-center text-sm font-medium" aria-live="polite">{item.quantity}</span>
                              <button type="button" aria-label={`Increase quantity of ${item.product.name}`} disabled={atLimit} onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-control text-muted transition-colors hover:bg-panel hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric disabled:cursor-not-allowed disabled:opacity-35">
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            {atLimit && <p className="mt-2 text-xs text-accent">Maximum available quantity</p>}
                          </div>
                          <button type="button" onClick={() => removeItem(item.product._id)} aria-label={`Remove ${item.product.name}`} className="inline-flex min-h-9 items-center gap-2 rounded-control px-2 text-xs text-muted transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="lg:sticky lg:top-28 lg:h-fit">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <PackageCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h2 className="text-lg font-semibold">Order summary</h2>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Subtotal ({getTotalItems()} items)</span><span>{formatPrice(getSubtotal())}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Shipping</span><span className={getSubtotal() > 100 ? 'text-accent' : 'text-muted'}>{getSubtotal() > 100 ? 'Free' : formatPrice(shipping)}</span></div>
                  {getSubtotal() < 100 && <p className="border-l border-accent pl-3 text-xs leading-5 text-muted">Add {formatPrice(100 - getSubtotal())} more to unlock free shipping.</p>}
                  <div className="flex justify-between border-t border-line pt-4 text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <Button className="mt-6 w-full" size="lg" onClick={() => router.push(user ? '/checkout' : '/sign-in?redirect=/checkout')}>
                  {user ? 'Continue to checkout' : 'Sign in to checkout'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!user && <p className="mt-3 text-center text-xs leading-5 text-muted">Your bag stays saved while you sign in.</p>}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
