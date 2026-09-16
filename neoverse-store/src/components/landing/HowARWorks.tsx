'use client'

import { CircleDollarSign, Ruler, Search, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/scroll-reveal'


interface Step {
  number: string
  icon: LucideIcon
  doubt: string
  resolution: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: Search,
    doubt: 'Which details actually matter?',
    resolution:
      'Start with the product facts that affect the decision: dimensions, material, rating, price, and current availability.',
  },
  {
    number: '02',
    icon: Ruler,
    doubt: 'Will the shape and scale work here?',
    resolution:
      'Open the available 3D or spatial tool when the product supports it, then inspect the object from the angle that matters to you.',
  },
  {
    number: '03',
    icon: CircleDollarSign,
    doubt: 'What will I pay today?',
    resolution:
      'Get a server-calculated quote before payment so the price, shipping, tax, discounts, and stock are checked together.',
  },
]

export function HowARWorks() {
  return (
    <section className="relative border-b border-line py-20 sm:py-28 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="mb-3 text-sm font-medium text-electric">From uncertainty to a useful answer</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              Inspect what matters before you buy.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              A better product decision starts with evidence, not more promotional copy.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 relative max-w-md mx-auto lg:mx-0">
            <div className="mb-4 text-sm text-muted">A purchase decision, made visible</div>
            <div className="relative aspect-9/16 max-w-70 mx-auto">
              <div className="absolute inset-0 rounded-[40px] border border-electric/20 bg-panel shadow-glow" />
              <div
                className="relative inset-4 flex flex-col items-center justify-center overflow-hidden rounded-4xl border border-line bg-panel p-6"
                style={{ margin: 16 }}
              >
                <Search className="mb-4 h-10 w-10 text-electric" />
                <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-surface border border-line bg-panel-soft">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-control border border-line bg-panel">
                      <Ruler className="h-8 w-8 text-electric" />
                    </div>
                    <p className="text-xs text-muted">Product evidence</p>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between border-b border-line pb-2 text-xs text-muted"><span>Price</span><span className="tabular-nums text-paper">Verified at checkout</span></div>
                  <div className="flex items-center justify-between border-b border-line pb-2 text-xs text-muted"><span>Availability</span><span className="text-accent">Checked live</span></div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-1 rounded-full bg-line-strong" />
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
                        <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-control border border-line bg-panel">
                          <Icon className="h-6 w-6 text-electric" />
                        </div>
                        {!isLast && (
                          <div className="mt-2 w-px flex-1 bg-linear-to-b from-electric/40 to-transparent" />
                        )}
                      </div>

                      <div className="pt-1">
                        <span className="text-xs font-medium text-electric/70">
                          Step {step.number}
                        </span>
                        <p className="mt-1 text-sm italic text-muted">
                          &ldquo;{step.doubt}&rdquo;
                        </p>
                        <h3 className="mt-1 font-display text-xl font-semibold text-paper">
                          {step.resolution}
                        </h3>
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
