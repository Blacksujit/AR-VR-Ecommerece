'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import StoreMap from '@/components/ui/StoreMap'
import AIChatBot from '@/components/ai/AIChatBot'
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, MessageSquare, HeadphonesIcon } from 'lucide-react'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@neoverse.com', desc: 'We reply within 24 hours' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9AM-6PM EST' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA', desc: 'Silicon Valley HQ' },
  { icon: Clock, label: 'Support Hours', value: '24/7 Live Chat', desc: 'Always here to help' },
]

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders directly from your dashboard under "My Orders".' },
  { q: 'What is your return policy?', a: 'We offer a 30-day no-questions-asked return policy on all items. Products must be returned in their original condition and packaging.' },
  { q: 'Do you support international shipping?', a: 'Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination and are calculated at checkout.' },
  { q: 'Can I try products with AR before buying?', a: 'Absolutely! Our AR feature lets you visualize products in your space before purchasing. Just look for the "View in AR" button on product pages.' },
  { q: 'How does the VR Showroom work?', a: 'The VR Showroom offers an immersive 3D shopping experience. You can browse our entire catalog in a virtual space using your browser — no headset required.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and cryptocurrency (BTC, ETH).' },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <HeadphonesIcon className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Let&apos;s <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map(({ icon: Icon, label, value, desc }, i) => (
            <ScrollReveal key={label} delay={i * 0.1}>
              <Card className="p-6 text-center hover:border-primary/30 transition-all duration-500 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{label}</h3>
                <p className="text-white/90 font-medium">{value}</p>
                <p className="text-sm text-white/40 mt-1">{desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <ScrollReveal>
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Send us a Message</h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p className="text-white/60">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Message</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" isLoading={isSubmitting} className="w-full">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Card className="p-8 h-full">
              <h2 className="text-xl font-semibold mb-6">Our Location</h2>
              <div className="rounded-xl overflow-hidden h-[320px] border border-white/10">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4194%2C37.7749%2C-122.3944%2C37.7849&amp;layer=mapnik"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NeoVerse Location"
                />
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Address', value: '123 NeoVerse Street, Suite 400, San Francisco, CA 94105' },
                  { label: 'Office Hours', value: 'Monday - Friday: 9:00 AM - 6:00 PM PST' },
                  { label: 'Weekend Support', value: 'Saturday - Sunday: 10:00 AM - 4:00 PM PST' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-white/40 min-w-[100px]">{label}</span>
                    <span className="text-white/70">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-white/40">Quick answers to common questions</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-white/60 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Card className="p-6 md:p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Visit Our Showroom</h2>
            </div>
            <StoreMap
              latitude={40.7128}
              longitude={-74.0060}
              storeName="NeoVerse Store"
              storeAddress="123 NeoVerse Street, New York, NY 10001"
            />
          </Card>
        </ScrollReveal>
      </div>

      <AIChatBot />
    </div>
  )
}
