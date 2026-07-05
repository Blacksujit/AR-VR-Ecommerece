'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { api, type ApiResponse } from '@/lib/api'
import type { RecentlyViewedItem, Product } from '@/types'
import { motion } from 'framer-motion'
import { Clock, Eye, Trash2, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
}

export default function RecentlyViewedPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: dataRes, isLoading } = useQuery({
    queryKey: ['recently-viewed'],
    queryFn: () => api.get<ApiResponse<RecentlyViewedItem[]>>('/user/recently-viewed'),
    enabled: !!user,
  })

  const clearMutation = useMutation({
    mutationFn: () => api.delete('/user/recently-viewed'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recently-viewed'] }),
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  const items = dataRes?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Recently Viewed</h1>
          <p className="text-white/40 mt-1">Products you&apos;ve checked out</p>
        </div>
        {items.length > 0 && (
          <Button onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending} variant="ghost" className="text-white/40 hover:text-error">
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No recently viewed products</h2>
          <p className="text-white/40">Start browsing to see your history here</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((rv) => {
            const p = rv.product as Product
            return (
              <motion.div key={rv._id} variants={itemAnim}>
                <Link href={`/products/${p.slug || p._id}`}>
                  <Card className="group overflow-hidden hover:border-primary/30 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 relative">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl">?</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge className="bg-black/60 text-white text-[10px]">
                          <Eye className="w-3 h-3 mr-1" /> Viewed
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-primary">{formatPrice(p.price)}</span>
                        <span className="text-[10px] text-white/30">
                          {new Date(rv.viewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
