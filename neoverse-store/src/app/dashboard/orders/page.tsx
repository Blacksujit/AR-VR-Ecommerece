'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api, type ApiResponse } from '@/lib/api'
import type { Order } from '@/types'
import { motion } from 'framer-motion'
import { Package, Search, Loader2, ShoppingBag, ChevronRight, Eye, Download, Truck } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-accent/10 text-accent border-accent/20',
  shipped: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

const statusIcons: Record<string, typeof Truck> = {
  pending: Package,
  confirmed: Package,
  shipped: Truck,
  delivered: Truck,
  cancelled: Package,
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get<ApiResponse<Order[]>>('/orders/myorders'),
    enabled: !!user,
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  const orders = (ordersRes?.data ?? []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return o._id.toLowerCase().includes(q) || o.items?.some((i) => i.product?.name?.toLowerCase().includes(q))
    }
    return true
  })

  const tabs = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length },
    { key: 'shipped', label: 'Shipped', count: orders.filter((o) => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Orders</h1>
        <p className="text-white/40 mt-1">Track and manage your orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or product..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all border',
              statusFilter === key
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'
            )}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-white/40 mb-6">You haven&apos;t placed any orders yet</p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const StatusIcon = statusIcons[order.status] || Package
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="p-5 hover:border-primary/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', statusStyles[order.status] || 'bg-white/10')}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {order.items[0]?.product?.name || `Order #${order._id.slice(-6)}`}
                          {order.items.length > 1 && <span className="text-white/40 ml-1">+{order.items.length - 1} more</span>}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          #{order._id.slice(-8).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full border capitalize', statusStyles[order.status] || '')}>
                            {order.status}
                          </span>
                          {order.isPaid && <span className="text-[10px] text-success">Paid</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
                        <p className="text-xs text-white/40">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                      </div>
                      <Link href={`/dashboard/orders`} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </Link>
                    </div>
                  </div>

                  {order.items.length > 1 && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                      {order.items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center text-[10px] font-bold text-white/40">
                          {item.product?.name?.charAt(0) || '?'}
                        </div>
                      ))}
                      {order.items.length > 5 && (
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/30">
                          +{order.items.length - 5}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    {order.status === 'shipped' && (
                      <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                        <Eye className="w-3.5 h-3.5" /> Track Order
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
