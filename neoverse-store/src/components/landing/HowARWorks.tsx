'use client'

import { Camera, Ruler, ShieldCheck, type LucideIcon } from 'lucide-react'
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
    icon: Camera,
    doubt: 'Will the color match my room?',
    resolution:
      'Point your camera and the product renders in your actual lighting. See the true shade, not a studio photo.',
  },
  {
    number: '02',
    icon: Ruler,
    doubt: 'Will it fit in that corner?',
    resolution:
      'Place the 3D model at true scale. Walk around it, move it, adjust — before you commit a cent.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    doubt: 'What if it looks different in person?',
    resolution:
      "You've already seen it in your space from every angle. Buy with confidence — no surprises, no 'not what I expected' returns.",
  },
]

export function HowARWorks() {
  return (
    <section className="relative border-b border-line py-20 sm:py-28 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="mb-3 text-sm font-medium text-electric">A simpler way to decide</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              See the answer in your space.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Every product page removes the single biggest doubt — fit, scale, or
              material — before you add to cart.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 relative max-w-md mx-auto lg:mx-0">
            <div className="relative aspect-9/16 max-w-70 mx-auto">
              <div className="absolute inset-0 rounded-[40px] border border-electric/20 bg-panel shadow-glow" />
              <div
                className="relative inset-4 flex flex-col items-center justify-center overflow-hidden rounded-4xl border border-line bg-panel p-6"
                style={{ margin: 16 }}
              >
                <Camera className="mb-4 h-10 w-10 text-electric" />
                <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-surface border border-line bg-panel-soft">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-control border border-line bg-panel">
                      <Ruler className="h-8 w-8 text-electric" />
                    </div>
                    <p className="text-xs text-muted">True scale</p>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 rounded-full bg-panel-soft" />
                  <div className="h-2 w-2/3 rounded-full bg-panel-soft" />
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
