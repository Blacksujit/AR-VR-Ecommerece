'use client'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import dynamic from 'next/dynamic'
import { api, type ApiResponse } from '@/lib/api'
import type { Product, Order } from '@/types'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react'

const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })

export default function AdminPage() {
  const { user, isLoading, isAuthorized } = useAuthGuard('admin')
  const router = useRouter()

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<ApiResponse<Order[]>>('/orders?limit=50'),
    enabled: !!user && user.role === 'admin',
  })

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get<ApiResponse<Product[]>>('/products?limit=50'),
    enabled: !!user && user.role === 'admin',
  })

  const orders = ordersData?.data ?? []
  const products = productsData?.data ?? []
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalUsers = new Set(orders.map(o => o.user?.toString())).size
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - 5 + i)
    const month = d.toLocaleString('default', { month: 'short' })
    const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === d.getMonth())
    const revenue = monthOrders.reduce((s, o) => s + o.totalPrice, 0)
    return { name: month, revenue: Math.round(revenue), orders: monthOrders.length }
  })

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: `${orders.length} orders`, icon: DollarSign, trend: 'up' },
    { label: 'Total Orders', value: String(orders.length), change: `${pendingOrders} pending`, icon: ShoppingCart, trend: 'up' },
    { label: 'Active Users', value: String(totalUsers), change: 'Unique customers', icon: Users, trend: 'up' },
    { label: 'Active Products', value: String(products.length), change: `${products.filter(p => p.stock > 0).length} in stock`, icon: Package, trend: 'up' },
  ] as const

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-white/40 mt-1">Manage your store and view analytics</p>
          </div>
          <Badge variant="gradient">Admin</Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, change, icon: Icon, trend }) => (
            <ScrollReveal key={label}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/40">{label}</span>
                  <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-success/10' : 'bg-error/10'}`}>
                    <Icon className={`w-4 h-4 ${trend === 'up' ? 'text-success' : 'text-error'}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {trend === 'up' ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-error" />}
                  <span className={`text-xs ${trend === 'up' ? 'text-success' : 'text-error'}`}>{change}</span>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold mb-4">Revenue Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="#5b7fff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[{ label: 'Add Product', href: '/products' }, { label: 'View Analytics', href: '/admin' }, { label: 'Manage Users', href: '/admin' }, { label: 'Check Inventory', href: '/products?inStock=true' }].map(({ label, href }) => (
                <button key={label} onClick={() => router.push(href)} className="w-full glass glass-hover rounded-xl px-4 py-3 text-sm text-left hover:text-primary transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-white/40 font-medium">Order</th>
                  <th className="text-left py-3 text-white/40 font-medium">Customer</th>
                  <th className="text-left py-3 text-white/40 font-medium">Amount</th>
                  <th className="text-left py-3 text-white/40 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 text-white/60">{order.user?.toString() ?? 'Unknown'}</td>
                    <td className="py-3 font-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3">
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'primary' : order.status === 'confirmed' ? 'accent' : 'warning'}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-white/40">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
