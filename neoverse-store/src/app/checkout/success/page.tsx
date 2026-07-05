'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api, type ApiResponse } from '@/lib/api'
import { formatPrice, formatDiscount } from '@/lib/utils'
import type { Order } from '@/types'
import {
  CheckCircle2,
  Loader2,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

interface SessionStatus {
  order: Order
  paymentStatus: string
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [orderData, setOrderData] = useState<SessionStatus | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    if (!sessionId) {
      router.replace('/cart')
      return
    }
    let mounted = true

    api
      .get<ApiResponse<SessionStatus>>(`/stripe/session-status/${sessionId}`)
      .then(res => {
        if (!mounted) return
        const data = res.data ?? res
        setOrderData(data as SessionStatus)
        setStatus('success')
      })
      .catch(err => {
        if (!mounted) return
        setErrorMsg(err instanceof Error ? err.message : 'Failed to verify payment')
        setStatus('error')
      })

    return () => {
      mounted = false
    }
  }, [sessionId, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-3">Verifying Payment</h1>
          <p className="text-white/50">Please wait while we confirm your order...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-3">Payment Verification Failed</h1>
          <p className="text-white/50 mb-2">{errorMsg || 'Something went wrong verifying your payment.'}</p>
          <p className="text-white/30 text-sm mb-8">
            Please check your orders in the dashboard or contact support.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="glass" onClick={() => router.push('/cart')}>
              Back to Cart
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              View Orders
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const order = orderData?.order

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-white/40 mb-6">We could not locate your order details.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CheckCircle2 className="w-12 h-12 text-success" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-display font-bold mb-3"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50"
          >
            Thank you for your purchase. Your order has been placed successfully.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Order Details</h2>
                <p className="text-xs text-white/40 font-mono">#{order._id}</p>
              </div>
              <Badge variant={order.status === 'confirmed' || order.status === 'pending' ? 'success' : 'primary'} className="ml-auto">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              {order.items.map((item, i) => (
                <motion.div
                  key={item.product?._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-white/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatPrice((item.product?.price ?? 0) * item.quantity)}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Shipping</span>
                {order.shippingPrice === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  <span>{formatPrice(order.shippingPrice)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Tax</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-white/40">Payment</p>
                <p className="text-sm font-medium capitalize">{order.paymentMethod || 'Card'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-white/40">Delivery</p>
                <p className="text-sm font-medium">5-8 business days</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              View My Orders
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <Loader2 className="w-8 h-8 text-[#5B7FFF] animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
