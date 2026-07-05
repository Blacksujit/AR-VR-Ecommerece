'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Code2, MessageCircle, Camera, Play, Mail, ArrowRight } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'VR Showroom', href: '/vr-showroom' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Contact', href: '/contact' },
]

const socialLinks = [
  { icon: Code2, href: 'https://github.com', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Play, href: 'https://youtube.com', label: 'Youtube' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Silently fail
    }
    setEmail('')
  }

  return (
    <footer className="relative bg-surface/50 border-t border-glass-border">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight gradient-text font-display">
                NeoVerse
              </span>
            </Link>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Experience the next generation of online shopping with immersive
              AR/VR technology. Browse, interact, and purchase products in
              stunning 3D environments.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl glass glass-hover text-foreground/60 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Stay updated with the latest drops, AR experiences, and exclusive
              offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-10 pl-10 pr-3 text-sm bg-glass border border-glass-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center h-10 w-10 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors shrink-0"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground/40">
              &copy; {new Date().getFullYear()} NeoVerse Store. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-foreground/40">Visa</span>
              <span className="text-xs text-foreground/40">Mastercard</span>
              <span className="text-xs text-foreground/40">PayPal</span>
              <span className="text-xs text-foreground/40">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
