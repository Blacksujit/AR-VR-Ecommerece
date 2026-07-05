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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center">
            Returns & <span className="gradient-text">Exchanges</span>
          </h1>
          <p className="text-white/60 text-center mb-12">Hassle-free returns within 30 days</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.1}>
              <Card className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
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
