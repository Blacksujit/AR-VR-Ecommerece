'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Ruler } from 'lucide-react'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
              <Ruler className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Size <span className="gradient-text">Guide</span>
            </h1>
            <p className="text-white/60">Find your perfect fit for wearables and accessories</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">VR Headset Sizing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left py-3 text-white/40 font-medium">Size</th><th className="text-left py-3 text-white/40 font-medium">IPD Range</th><th className="text-left py-3 text-white/40 font-medium">Head Circumference</th><th className="text-left py-3 text-white/40 font-medium">Recommended</th></tr></thead>
                <tbody>
                  <tr className="border-b border-white/5"><td className="py-3">Small</td><td className="text-white/60">54-58mm</td><td className="text-white/60">52-56cm</td><td className="text-white/60">Youth / Narrow face</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3">Medium</td><td className="text-white/60">58-64mm</td><td className="text-white/60">55-59cm</td><td className="text-white/60">Average adult</td></tr>
                  <tr><td className="py-3">Large</td><td className="text-white/60">64-72mm</td><td className="text-white/60">58-63cm</td><td className="text-white/60">Wider face / Larger head</td></tr>
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-4">Wearable Sizing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left py-3 text-white/40 font-medium">Size</th><th className="text-left py-3 text-white/40 font-medium">Wrist (Haptic Gloves)</th><th className="text-left py-3 text-white/40 font-medium">Head (Smart Glasses)</th><th className="text-left py-3 text-white/40 font-medium">Chest (Gaming Suit)</th></tr></thead>
                <tbody>
                  <tr className="border-b border-white/5"><td className="py-3">S</td><td className="text-white/60">14-16cm</td><td className="text-white/60">52-54cm</td><td className="text-white/60">86-91cm</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3">M</td><td className="text-white/60">16-18cm</td><td className="text-white/60">54-58cm</td><td className="text-white/60">91-97cm</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3">L</td><td className="text-white/60">18-20cm</td><td className="text-white/60">58-62cm</td><td className="text-white/60">97-107cm</td></tr>
                  <tr><td className="py-3">XL</td><td className="text-white/60">20-22cm</td><td className="text-white/60">62-66cm</td><td className="text-white/60">107-117cm</td></tr>
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
