'use client'

import Link from 'next/link'
import { CircleDollarSign, Ruler, Search, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface Step {
  label: string
  icon: LucideIcon
  question: string
  answer: string
}

const steps: Step[] = [
  {
    label: 'Find',
    icon: Search,
    question: 'Start with the question you need answered.',
    answer: 'Search and filter the catalog by the details that affect your decision, including category, price, rating, and availability.',
  },
  {
    label: 'Inspect',
    icon: Ruler,
    question: 'Look closer when the product supports it.',
    answer: 'Review the real images and specifications. Verified 3D and AR controls appear only when the product has the required assets.',
  },
  {
    label: 'Confirm',
    icon: CircleDollarSign,
    question: 'Check the transaction before you commit.',
    answer: 'The commerce API recalculates the quote and checks current inventory before payment begins.',
  },
]

export function HowARWorks() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              A clearer path to a considered purchase.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              NeoVerse keeps discovery, inspection, and checkout connected so the important details do not disappear between tabs.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-0 border-y border-line lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <ScrollReveal key={step.label} delay={index * 0.1} direction="up">
                <article className="group relative min-h-70 border-b border-line p-6 last:border-b-0 sm:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-sm font-medium text-electric">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {step.label}
                    </span>
                    <span className="text-xs tabular-nums text-faint">0{index + 1}</span>
                  </div>
                  <h3 className="mt-12 max-w-xs font-display text-2xl font-medium leading-tight text-paper">
                    {step.question}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{step.answer}</p>
                </article>
              </ScrollReveal>
            )
          })}
        </div>

        <Link href="/products" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-electric transition-colors hover:text-electric-strong">
          Browse the catalog
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
