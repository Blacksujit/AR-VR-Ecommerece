'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Truck, Package, Globe, Clock } from 'lucide-react'

const policies = [
  { icon: Truck, title: 'Standard Shipping', desc: '3-5 business days. Free on orders over $50.' },
  { icon: Clock, title: 'Express Shipping', desc: '1-2 business days. Flat rate $12.99.' },
  { icon: Globe, title: 'International Shipping', desc: '7-14 business days. Calculated at checkout.' },
  { icon: Package, title: 'Order Processing', desc: 'Orders are processed within 24 hours of placement.' },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm text-muted">Delivery information</p>
            <h1 className="mt-2 text-4xl font-display font-medium tracking-tight md:text-5xl">Shipping, clearly explained</h1>
            <p className="mt-4 text-base leading-7 text-muted">Timing, cost, and what happens after you place an order.</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {policies.map(({ icon: Icon, title, desc }, i) => (
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
