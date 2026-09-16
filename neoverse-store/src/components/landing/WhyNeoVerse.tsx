'use client'

import { CircleDollarSign, Ruler, SearchCheck, type LucideIcon } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Card } from '@/components/ui/card'

interface Benefit {
  icon: LucideIcon
  title: string
  description: string

}

const benefits: Benefit[] = [
  {
    icon: SearchCheck,
    title: 'See the useful details',
    description:
      'Product pages bring specifications, ratings, availability, and imagery together so comparison does not require a dozen tabs.',

  },
  {
    icon: Ruler,
    title: 'Check fit and proportion',
    description:
      'Use supported 3D and spatial tools to understand scale and form before an object arrives at your door.',

  },
  {
    icon: CircleDollarSign,
    title: 'Know what you are paying',
    description:
      'Checkout quotes are calculated on the server with current pricing, discounts, shipping, tax, and stock checks.'

  },
]

export function WhyNeoVerse() {
  return (
    <section className="relative border-b border-line py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="mb-3 text-sm font-medium text-electric">The difference is practical</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              Confidence, built into the product page
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              The experience is built around the questions that usually create hesitation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <ScrollReveal key={benefit.title} delay={index * 0.15} direction="up">
                <Card
                  variant="default"
                  className="group relative h-full overflow-hidden p-7 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft lg:p-8"
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-control border border-line bg-panel-soft transition-colors duration-200 group-hover:bg-electric/10">
                      <Icon className="h-6 w-6 text-electric" />
                    </div>

                    <h3 className="mb-4 font-display text-xl font-semibold text-paper">
                      {benefit.title}
                    </h3>

                    <p className="leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>


                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
