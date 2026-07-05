'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api, type ApiResponse } from '@/lib/api'
import type { Notification } from '@/types'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, Loader2, Package, Truck, Tag, AlertCircle, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeIcons: Record<string, typeof Bell> = {
  order: Package,
  wishlist: Truck,
  promo: Tag,
  review: AlertCircle,
  system: Megaphone,
}

const typeStyles: Record<string, string> = {
  order: 'bg-primary/10 text-primary',
  wishlist: 'bg-accent/10 text-accent',
  promo: 'bg-success/10 text-success',
  review: 'bg-warning/10 text-warning',
  system: 'bg-accent/10 text-accent',
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const { data: notifsRes, isLoading } = useQuery({
    queryKey: ['user-notifications'],
    queryFn: () => api.get<ApiResponse<Notification[]>>('/user/notifications'),
    enabled: !!user,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/user/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-notifications'] }),
  })

  const markAllRead = useMutation({
    mutationFn: () => api.post('/user/notifications/read-all', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-notifications'] }),
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  const rawNotifs = notifsRes?.data
  const notifList: Notification[] = Array.isArray(rawNotifs) ? rawNotifs : (rawNotifs as any)?.notifications ?? []
  const allNotifs = notifList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered = typeFilter === 'all' ? allNotifs : allNotifs.filter((n) => n.type === typeFilter)

  const unreadCount = allNotifs.filter((n) => !n.isRead).length

  const tabs = [
    { key: 'all', label: 'All', count: allNotifs.length },
    { key: 'order', label: 'Order', count: allNotifs.filter((n) => n.type === 'order').length },
    { key: 'wishlist', label: 'Wishlist', count: allNotifs.filter((n) => n.type === 'wishlist').length },
    { key: 'promo', label: 'Promos', count: allNotifs.filter((n) => n.type === 'promo').length },
    { key: 'review', label: 'Reviews', count: allNotifs.filter((n) => n.type === 'review').length },
    { key: 'system', label: 'System', count: allNotifs.filter((n) => n.type === 'system').length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Notifications</h1>
          <p className="text-white/40 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending} variant="ghost" className="text-primary">
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all border',
              typeFilter === key
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
          <Bell className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No notifications</h2>
          <p className="text-white/40">You&apos;re all up to date</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const TypeIcon = typeIcons[notif.type] || Bell
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card
                  className={cn(
                    'p-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-white/[0.02]',
                    !notif.isRead && 'border-primary/20 bg-primary/[0.02]'
                  )}
                  onClick={() => { if (!notif.isRead) markRead.mutate(notif._id) }}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeStyles[notif.type] || 'bg-white/10')}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn('text-sm', !notif.isRead && 'font-semibold')}>{notif.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{notif.message}</p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1.5">
                      {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
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
