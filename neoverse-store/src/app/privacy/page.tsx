'use client'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-white/60">Last updated: January 2026</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
              <p className="text-white/50 text-sm leading-relaxed">We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email, shipping address, and payment details.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
              <p className="text-white/50 text-sm leading-relaxed">Your data is used to process orders, improve our services, send relevant recommendations, and provide customer support. We never sell your personal data to third parties.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
              <p className="text-white/50 text-sm leading-relaxed">We implement industry-standard encryption and security measures to protect your data. All payment information is processed through PCI-compliant gateways.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
              <p className="text-white/50 text-sm leading-relaxed">You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@neoverse.com for requests.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
              <p className="text-white/50 text-sm leading-relaxed">We use essential cookies for authentication and analytics. You can manage cookie preferences in your browser settings.</p>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
