'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Sparkles, Shield, Globe, Cpu } from 'lucide-react'

const values = [
  { icon: Sparkles, title: 'Innovation First', desc: 'We push the boundaries of what\'s possible in e-commerce through AR, VR, and AI technologies.' },
  { icon: Shield, title: 'Trust & Security', desc: 'Your privacy and security are paramount. We use industry-leading encryption and secure payment processing.' },
  { icon: Globe, title: 'Global Reach', desc: 'Shipping to over 50 countries worldwide with localized shopping experiences in 12 languages.' },
  { icon: Cpu, title: 'Cutting-Edge Tech', desc: 'From neural interfaces to holographic displays, we bring you the latest in technology.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              About <span className="gradient-text">NeoVerse</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              We are building the future of shopping — where the physical and digital worlds converge.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-display font-bold mb-4">Our Mission</h2>
            <p className="text-white/60 leading-relaxed">
              NeoVerse was founded with a singular vision: to transform how people discover, interact with, and purchase products. By leveraging augmented reality, virtual reality, and artificial intelligence, we create immersive shopping experiences that were once the stuff of science fiction.
            </p>
            <p className="text-white/60 leading-relaxed mt-4">
              Our platform enables you to visualize products in your own space before buying, step into a virtual showroom from anywhere in the world, and receive personalized recommendations powered by advanced AI. We believe that the future of commerce is experiential, and we are proud to lead the way.
            </p>
          </Card>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.1}>
              <Card className="p-6 hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
