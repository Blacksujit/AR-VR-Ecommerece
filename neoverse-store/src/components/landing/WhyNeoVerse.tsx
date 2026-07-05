'use client'

import { Box, Sparkles, Shield, type LucideIcon } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Card } from '@/components/ui/card'

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

const benefits: Benefit[] = [
  {
    icon: Box,
    title: 'AR/VR Shopping',
    description:
      'Try before you buy with immersive augmented reality. Place products in your real environment or explore them in full VR showrooms.',
    gradient: 'from-blue-600/20 to-cyan-600/10',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description:
      'Our intelligent engine learns your preferences and style, delivering hyper-personalized product suggestions that get better every time.',
    gradient: 'from-purple-600/20 to-pink-600/10',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description:
      'Every product is verified, tested, and backed by our premium quality guarantee. Shop with confidence and complete purchase protection.',
    gradient: 'from-emerald-600/20 to-teal-600/10',
  },
]

export function WhyNeoVerse() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              Why <span className="gradient-text">NeoVerse</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Redefining online shopping with cutting-edge technology
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <ScrollReveal key={benefit.title} delay={index * 0.15} direction="up">
                <Card
                  variant="glass"
                  className="group relative overflow-hidden p-8 lg:p-10 h-full transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[0_0_50px_rgba(91,127,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-300 group-hover:shadow-[0_0_30px_rgba(91,127,255,0.2)]">
                      <Icon className="w-8 h-8 text-primary-light" />
                    </div>

                    <h3 className="text-xl font-display font-semibold text-white mb-4">
                      {benefit.title}
                    </h3>

                    <p className="text-white/50 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
