'use client'

import { useState } from 'react'
import { Star, Send, Check, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { Review } from '@/types'
import toast from 'react-hot-toast'

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  isAuthenticated: boolean
  isSubmitting: boolean
  onSubmitReview: (data: { rating: number; title: string; comment: string }) => void
}

export function ReviewsSection({ reviews, rating, isAuthenticated, isSubmitting, onSubmitReview }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitReview(form)
    setShowForm(false)
    setForm({ rating: 5, title: '', comment: '' })
  }

  return (
    <ScrollReveal delay={0.1}>
      <Card variant="glass" className="p-6 sm:p-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Customer Reviews</h2>
          <Badge variant="gradient">{rating}/5 ({reviews.length})</Badge>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-white/40 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-white/5 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {review.user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{review.user?.name || 'Anonymous'}</span>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn('w-3 h-3', i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')}
                        />
                      ))}
                    </div>
                    {review.title && <p className="text-sm font-medium text-white/80 mb-1">{review.title}</p>}
                    <p className="text-sm text-white/50">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Rating:</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, rating: r }))} aria-label={`Rate ${r} stars`}>
                    <Star className={cn('w-5 h-5', r <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                  </button>
                ))}
              </div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-sm"
                placeholder="Review title"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 min-h-[100px] resize-none text-sm"
                placeholder="Share your experience..."
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" isLoading={isSubmitting}>
                  <Send className="w-4 h-4" />
                  Submit Review
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="glass" className="w-full" onClick={() => {
              if (!isAuthenticated) { toast.error('Please sign in to review'); return }
              setShowForm(true)
            }}>
              <MessageCircle className="w-4 h-4" />
              Write a Review
            </Button>
          )}
        </div>
      </Card>
    </ScrollReveal>
  )
}
