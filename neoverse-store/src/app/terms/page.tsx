'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ScrollText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-control border border-line bg-panel-soft">
              <ScrollText className="h-6 w-6 text-electric" />
            </div>
            <h1 className="text-4xl font-display font-medium tracking-tight md:text-5xl">Terms of service</h1>
            <p className="mt-4 text-muted">Last updated: January 2026</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p className="text-white/50 text-sm leading-relaxed">By accessing and using NeoVerse, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">2. Account Registration</h2>
              <p className="text-white/50 text-sm leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">3. Purchases & Payments</h2>
              <p className="text-white/50 text-sm leading-relaxed">All prices are listed in USD and exclude applicable taxes. Payment is due at the time of purchase. We reserve the right to cancel orders suspected of fraud.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">4. Shipping & Returns</h2>
              <p className="text-white/50 text-sm leading-relaxed">Shipping times are estimates and not guaranteed. Our 30-day return policy applies to all items in original condition.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
              <p className="text-white/50 text-sm leading-relaxed">NeoVerse shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
