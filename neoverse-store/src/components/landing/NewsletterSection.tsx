'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSubscribed(true)
        setEmail('')
      }
    } catch {
      // Silently fail — don't block the user
    }
  }

  return (
    <section className="relative py-24 sm:py-32">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-surface border border-line bg-panel">
            <div className="px-8 py-16 sm:px-16 sm:py-20 lg:px-24 lg:py-24">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-control border border-line bg-panel-soft">
                    <Mail className="h-5 w-5 text-electric" />
                  </div>

                  <h2 className="max-w-xl text-3xl font-display font-medium tracking-tight sm:text-4xl lg:text-5xl">New objects, useful updates.</h2>

                  <p className="mt-4 max-w-lg text-lg leading-8 text-muted">
                    Get occasional notes about new products, spatial tools, and practical buying guides.
                  </p>

                  <div className="mt-10 max-w-md mx-auto">
                    {subscribed ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-3 py-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-success" />
                        </div>
                        <span className="text-lg text-white/80">
                          You&apos;re on the list!
                        </span>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row items-center gap-3"
                      >
                        <div className="w-full">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            icon={<Mail className="w-4 h-4" />}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full sm:w-auto shrink-0 group"
                        >
                          Subscribe
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </form>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>No spam. Unsubscribe anytime.</span>
                  </div>
                </motion.div>
              </div>
            </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
