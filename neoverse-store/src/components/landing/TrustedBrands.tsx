'use client'

import { Box, Camera, Globe, Monitor, Smartphone } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

const capabilities = [
  { icon: Smartphone, name: 'Mobile inspection', description: 'Review the product from the device already in your hand.' },
  { icon: Camera, name: 'Real product media', description: 'See the images and specifications attached to the catalog record.' },
  { icon: Box, name: 'Verified 3D assets', description: '3D controls appear only when a product has a real model asset.' },
  { icon: Globe, name: 'Browser-first access', description: 'Browse the experience without requiring a separate app.' },
  { icon: Monitor, name: 'Desktop viewing', description: 'Inspect product details comfortably on a larger screen.' },
]

export function TrustedBrands() {
  return (
    <section className="border-b border-line py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="max-w-md font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl">
              The interface adapts to the evidence available.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted">
              A product with a verified 3D asset can offer deeper inspection. A product without one still gets a useful page with honest images, specifications, price, and availability.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map((item, index) => {
            const Icon = item.icon
            return (
              <ScrollReveal key={item.name} delay={index * 0.06} direction="up">
                <div className="h-full bg-ink p-5 sm:p-6">
                  <Icon className="h-5 w-5 text-electric" aria-hidden="true" />
                  <h3 className="mt-8 text-sm font-medium text-paper">{item.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted">{item.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
