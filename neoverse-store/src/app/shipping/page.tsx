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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center">
            Shipping <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-white/60 text-center mb-12">We ship globally with reliable carriers</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {policies.map(({ icon: Icon, title, desc }, i) => (
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
