'use client'

import { Search, Smartphone, Camera, ShoppingBag, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { cn } from '@/lib/utils'

interface Step {
  number: string
  icon: LucideIcon
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Products',
    description: 'Explore our curated catalog of cutting-edge products across all categories.',
  },
  {
    number: '02',
    icon: Smartphone,
    title: "Tap 'View in AR'",
    description: 'Select any AR-enabled product and tap the AR button to launch the experience.',
  },
  {
    number: '03',
    icon: Camera,
    title: 'Place in Your Space',
    description: 'Point your camera and see the product come to life in your real environment.',
  },
  {
    number: '04',
    icon: ShoppingBag,
    title: 'Purchase',
    description: 'Love what you see? Add to cart and checkout with complete confidence.',
  },
]

export function HowARWorks() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.04)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              How <span className="gradient-text">AR Shopping</span> Works
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Experience products like never before — right from your phone
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 relative max-w-md mx-auto lg:mx-0">
            <div className="relative aspect-[9/16] max-w-[280px] mx-auto">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-primary/20 via-purple/10 to-accent/10 animate-pulse-glow" />
              <div className="relative inset-4 rounded-[32px] glass overflow-hidden flex flex-col items-center justify-center p-6" style={{ margin: 16 }}>
                <Camera className="w-10 h-10 text-primary-light mb-4" />
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-2">
                      <Smartphone className="w-8 h-8 text-white/60" />
                    </div>
                    <p className="text-xs text-white/30">AR Preview</p>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 rounded-full bg-white/10" />
                  <div className="h-2 rounded-full bg-white/5 w-2/3" />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isLast = index === steps.length - 1

                return (
                  <ScrollReveal key={step.number} delay={index * 0.15} direction="right">
                    <motion.div
                      className="relative flex gap-6 pb-12 last:pb-0"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 relative z-10 group-hover:border-primary/30 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-primary-light" />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-primary/30 to-transparent" />
                        )}
                      </div>

                      <div className="pt-3">
                        <span className="text-xs text-primary-light/60 font-mono">
                          Step {step.number}
                        </span>
                        <h3 className="text-xl font-display font-semibold text-white mt-1">
                          {step.title}
                        </h3>
                        <p className="text-white/50 mt-2 leading-relaxed max-w-md">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
