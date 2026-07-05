'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive a tracking number via email. You can also track orders directly from your dashboard under "My Orders".' },
  { q: 'What is your return policy?', a: 'We offer a 30-day no-questions-asked return policy on all items. Products must be returned in their original condition and packaging. Please visit our Returns page for instructions.' },
  { q: 'Do you support international shipping?', a: 'Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination and are calculated at checkout.' },
  { q: 'How does AR shopping work?', a: 'Our AR feature lets you visualize products in your real space using your phone or tablet camera. Look for the "View in AR" button on product pages to try it.' },
  { q: 'What is the VR Showroom?', a: 'The VR Showroom offers an immersive 3D shopping experience where you can browse our catalog in a virtual space using your browser. No headset required.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and select cryptocurrencies.' },
  { q: 'How do I create an account?', a: 'Click the profile icon in the top right corner and select "Sign Up". You can register with your email address or use Google/GitHub OAuth.' },
  { q: 'Is my payment information secure?', a: 'Yes. We use industry-standard SSL encryption and never store your full payment details. All transactions are processed through PCI-compliant payment gateways.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-white/60">Everything you need to know about shopping on NeoVerse</p>
          </div>
        </ScrollReveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.03}>
              <Card className="overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
