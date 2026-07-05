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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,127,255,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl p-1 gradient-border">
            <div className="relative rounded-[23px] bg-background overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(91,127,255,0.05)_0%,transparent_50%)]" />

              <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 lg:px-24 lg:py-24 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-8 animate-float">
                    <Mail className="w-8 h-8 text-primary-light" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
                    Stay Ahead of the{' '}
                    <span className="gradient-text">Future</span>
                  </h2>

                  <p className="mt-4 text-white/50 text-lg max-w-lg mx-auto">
                    Subscribe for exclusive drops, AR experiences, and early
                    access to next-gen products.
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

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>No spam. Unsubscribe anytime.</span>
                  </div>
                </motion.div>
              </div>

              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
