'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { RotateCcw, Check, AlertCircle, CreditCard } from 'lucide-react'

const steps = [
  { icon: RotateCcw, title: '30-Day Returns', desc: 'You have 30 days from delivery to initiate a return for any reason.' },
  { icon: Check, title: 'Condition', desc: 'Products must be in original condition and packaging for a full refund.' },
  { icon: AlertCircle, title: 'Process', desc: 'Start a return from your dashboard. Print the prepaid label and drop off at any carrier location.' },
  { icon: CreditCard, title: 'Refunds', desc: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm text-muted">After delivery</p>
            <h1 className="mt-2 text-4xl font-display font-medium tracking-tight md:text-5xl">Returns and exchanges</h1>
            <p className="mt-4 text-base leading-7 text-muted">What to expect if an object is not right for your space.</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.1}>
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-control border border-line bg-panel-soft">
                  <Icon className="h-6 w-6 text-electric" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-white/50 text-sm">{desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
