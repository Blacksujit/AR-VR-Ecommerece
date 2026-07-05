'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api, type ApiResponse } from '@/lib/api'
import type { Order, RecentlyViewedItem } from '@/types'
import { Package, Heart, Clock, ShoppingBag, TrendingUp, ArrowRight, Star, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

export default function DashboardHome() {
  const { user, isLoading: authLoading } = useAuth()

  const { data: ordersRes, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get<ApiResponse<Order[]>>('/orders/myorders'),
    enabled: !!user,
  })

  const { data: recentRes, isLoading: recentLoading } = useQuery({
    queryKey: ['recently-viewed'],
    queryFn: () => api.get<ApiResponse<RecentlyViewedItem[]>>('/user/recently-viewed'),
    enabled: !!user,
  })

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const orders = ordersRes?.data ?? []
  const recentItems = recentRes?.data ?? []
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed')
  const deliveredOrders = orders.filter((o) => o.status === 'delivered')
  const wishlistCount = user?.wishlist?.length ?? 0

  const stats = [
    { icon: Package, label: 'Total Orders', value: orders.length, sub: `${pendingOrders.length} pending`, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: TrendingUp, label: 'Delivered', value: deliveredOrders.length, sub: 'Completed orders', color: 'text-success', bg: 'bg-success/10' },
    { icon: Heart, label: 'Wishlist', value: wishlistCount, sub: 'Saved items', color: 'text-error', bg: 'bg-error/10' },
    { icon: Clock, label: 'Recently Viewed', value: recentItems.length, sub: 'Products', color: 'text-accent', bg: 'bg-accent/10' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-white/40 mt-1">Here&apos;s what&apos;s happening with your account</p>
        </div>
        {user?.createdAt && (
          <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full hidden sm:block">
            Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4 hover:border-primary/30 transition-all">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-white/40">{label}</p>
              <p className="text-xs text-white/30 mt-0.5">{sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Recent Orders
            </h3>
            <Link href="/dashboard/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40">No orders yet</p>
              <Link href="/products" className="text-xs text-primary hover:underline mt-1 inline-block">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link key={order._id} href={`/dashboard/orders`} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{order.items[0]?.product?.name || `Order #${order._id.slice(-6)}`}</p>
                    <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-semibold">{formatPrice(order.totalPrice)}</p>
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full capitalize',
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'shipped' ? 'bg-primary/10 text-primary' :
                      order.status === 'cancelled' ? 'bg-error/10 text-error' :
                      'bg-warning/10 text-warning'
                    )}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Recently Viewed
            </h3>
            <Link href="/dashboard/recently-viewed" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40">No recently viewed items</p>
              <Link href="/products" className="text-xs text-primary hover:underline mt-1 inline-block">Browse products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recentItems.slice(0, 4).map((item) => (
                <Link key={item._id} href={`/products/${item.product?.slug || ''}`} className="group">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-purple/10 flex items-center justify-center mb-2 overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-2xl font-bold text-white/20">{item.product?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{item.product?.name || 'Unknown'}</p>
                  <p className="text-xs text-white/40">{formatPrice(item.product?.price || 0)}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Browse Products', href: '/products', icon: ShoppingBag, desc: 'Explore our catalog' },
            { label: 'View Wishlist', href: '/wishlist', icon: Heart, desc: `${wishlistCount} items saved` },
            { label: 'Edit Profile', href: '/dashboard/profile', icon: Package, desc: 'Update your info' },
            { label: 'My Orders', href: '/dashboard/orders', icon: TrendingUp, desc: `${orders.length} total` },
          ].map(({ label, href, icon: Icon, desc }) => (
            <Link key={label} href={href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
              <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-white/40">{desc}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
