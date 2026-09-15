'use client'
import { useEffect, useState } from 'react'
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

interface ShippingData {
  fullName: string; email: string; phone: string
  street: string; city: string; state: string; zip: string; country: string
}

interface FieldErrors {
  [key: string]: string
}

interface QuoteItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface CheckoutQuote {
  items: QuoteItem[]
  currency: string
  subtotal: number
  shipping: number
  tax: number
  taxRate: number
  total: number
  expiresAt: string
}

function validateShipping(data: ShippingData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.fullName || data.fullName.trim().length < 2) errors.fullName = 'Full name is required'
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Valid email is required'
  if (!data.phone || data.phone.trim().length < 7) errors.phone = 'Phone number is required'
  if (!data.street || data.street.trim().length < 3) errors.street = 'Street address is required'
  if (!data.city || data.city.trim().length < 2) errors.city = 'City is required'
  if (!data.state || data.state.trim().length < 2) errors.state = 'State is required'
  if (!data.zip || data.zip.trim().length < 3) errors.zip = 'ZIP code is required'
  if (!data.country || data.country.trim().length < 2) errors.country = 'Country is required'
  return errors
}

export default function CheckoutPage() {
  const { items } = useCartStore()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [isPlacing, setIsPlacing] = useState(false)
  const [quote, setQuote] = useState<CheckoutQuote | null>(null)
  const [isQuoting, setIsQuoting] = useState(true)
  const [quoteError, setQuoteError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [shipping, setShipping] = useState<ShippingData>({
    fullName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'United States',
  })

  const updateField = (key: string, value: string) => {
    setShipping(p => ({ ...p, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors(p => { const n = { ...p }; delete n[key]; return n })
    }
  }

  useEffect(() => {
    let cancelled = false
    const loadQuote = async () => {
      setIsQuoting(true)
      setQuoteError('')
      try {
        await api.freshToken()
        const response = await api.post<{ success: boolean; data: CheckoutQuote }>('/orders/quote', {
          items: items.map(item => ({ product: item.product._id, quantity: item.quantity })),
        })
        if (!cancelled) setQuote(response.data)
      } catch (error) {
        if (!cancelled) setQuoteError(error instanceof Error ? error.message : 'Unable to confirm the order total')
      } finally {
        if (!cancelled) setIsQuoting(false)
      }
    }
    void loadQuote()
    return () => { cancelled = true }
  }, [items])

  const subtotal = quote?.subtotal ?? 0
  const shippingCost = quote?.shipping ?? 0
  const tax = quote?.tax ?? 0
  const total = quote?.total ?? 0

  const handleContinue = () => {
    const errors = validateShipping(shipping)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toast.error('Please fix the highlighted fields')
      return
    }
    if (!quote || new Date(quote.expiresAt).getTime() <= Date.now()) {
      setQuoteError('Your price confirmation expired. Refresh it before continuing.')
      return
    }
    setStep(s => s + 1)
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      return
    }
    if (!quote || new Date(quote.expiresAt).getTime() <= Date.now()) {
      setQuoteError('Your price confirmation expired. Refresh it before paying.')
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

  const shippingFields: { label: string; key: keyof ShippingData; type?: string; placeholder: string; colSpan?: number }[] = [
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

        {quoteError && (
          <div role="alert" className="mb-6 flex items-center justify-between gap-4 rounded-surface border border-error/40 bg-error/10 px-4 py-3 text-sm text-paper">
            <span>{quoteError}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Refresh quote</Button>
          </div>
        )}

        {isQuoting && (
          <div className="mb-6 rounded-surface border border-line bg-panel-soft px-4 py-3 text-sm text-muted" role="status">Confirming current prices and availability…</div>
        )}

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
                          value={shipping[key]}
                          onChange={e => updateField(key, e.target.value)}
                          error={fieldErrors[key]}
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
                <Button className="flex-1" onClick={handleContinue}>
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
                    <p className="text-sm font-semibold">{formatPrice(quote?.items.find(item => item.productId === product._id)?.lineTotal ?? 0)}</p>
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

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <Lock className="h-3 w-3" />
                <span>Price confirmed by the store</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
