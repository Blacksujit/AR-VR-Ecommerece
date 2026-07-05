'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { useCartStore } from '@/store/cart-store'
import { useAuth } from '@/components/auth/AuthContext'
import { api } from '@/lib/api'
import { formatPrice, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { CreditCard, Truck, Shield, Lock, ChevronRight, MapPin, Package, ChevronLeft, ShoppingCart } from 'lucide-react'

const steps = ['Shipping', 'Review']

export default function CheckoutPage() {
  const { items, getSubtotal } = useCartStore()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [isPlacing, setIsPlacing] = useState(false)
  const [shipping, setShipping] = useState({
    fullName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'United States',
  })

  const subtotal = getSubtotal()
  const shippingCost = subtotal >= 100 ? 0 : 9.99
  const taxRate = 0.08
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      return
    }
    setIsPlacing(true)
    try {
      await api.freshToken()
      const res = await api.post<{ success: boolean; data: { url: string; sessionId: string } }>(
        '/stripe/create-checkout-session',
        {
          items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: shipping.fullName,
            phone: shipping.phone,
            street: shipping.street,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
        }
      )

      window.location.href = res.data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate checkout')
    } finally {
      setIsPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-white/40 mb-6">Add some products before checking out.</p>
          <Button onClick={() => window.location.href = '/products'}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const shippingFields: { label: string; key: string; type?: string; placeholder: string; colSpan?: number }[] = [
    { label: 'Full Name', key: 'fullName', placeholder: 'John Doe', colSpan: 2 },
    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com', colSpan: 2 },
    { label: 'Phone Number', key: 'phone', placeholder: '+1 (555) 000-0000', colSpan: 2 },
    { label: 'Street Address', key: 'street', placeholder: '123 Main Street', colSpan: 2 },
    { label: 'City', key: 'city', placeholder: 'San Francisco' },
    { label: 'State', key: 'state', placeholder: 'CA' },
    { label: 'ZIP Code', key: 'zip', placeholder: '94105' },
    { label: 'Country', key: 'country', placeholder: 'United States' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Checkout</h1>
            <p className="text-white/50">Complete your purchase securely with Stripe</p>
          </div>
        </ScrollReveal>

        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                i <= step ? 'bg-primary text-white' : 'bg-white/10 text-white/40'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn('text-sm hidden sm:inline', i <= step ? 'text-white' : 'text-white/40')}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-white/20" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {shippingFields.map(({ label, key, type, placeholder, colSpan }) => (
                      <div key={key} className={colSpan === 2 ? 'col-span-2' : ''}>
                        <Input
                          label={label}
                          type={type || 'text'}
                          placeholder={placeholder}
                          value={shipping[key as keyof typeof shipping]}
                          onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Review Your Order</h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm text-white/40 mb-2">Shipping To</h4>
                      <div className="glass rounded-xl p-3 text-sm space-y-1">
                        <p className="font-medium">{shipping.fullName}</p>
                        <p className="text-white/60">{shipping.email}</p>
                        <p className="text-white/60">{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                        <p className="text-white/60">{shipping.country}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/40 mb-2">Payment</h4>
                      <div className="glass rounded-xl p-3 text-sm flex items-center gap-3">
                        <Lock className="w-4 h-4 text-primary" />
                        <span>Secured by Stripe • Credit/Debit Card</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    isLoading={isPlacing}
                    onClick={handlePlaceOrder}
                  >
                    <Lock className="w-4 h-4" />
                    Pay with Stripe - {formatPrice(total)}
                  </Button>
                  <p className="text-xs text-white/30 text-center mt-2">
                    You will be redirected to Stripe to complete payment
                  </p>
                </Card>
              </motion.div>
            )}

            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="glass" onClick={() => setStep(s => s - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {step < 1 && (
                <Button className="flex-1" onClick={() => setStep(s => s + 1)}>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-28">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-white/40">Qty: {quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    <span>{formatPrice(shippingCost)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/30 justify-center">
                <Lock className="w-3 h-3" />
                <span>Secure checkout</span>
                <Shield className="w-3 h-3 ml-2" />
                <span>SSL encrypted</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
