'use client'

import Link from 'next/link'
import { Code2, MessageCircle, Camera, Play } from 'lucide-react'

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
  { label: 'Privacy', href: '/privacy' },
]

const socialLinks = [
  { icon: Code2, href: 'https://github.com', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Play, href: 'https://youtube.com', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-block font-display text-xl font-semibold tracking-[-0.03em] text-paper">
              NeoVerse<span className="text-electric">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              A more considered way to shop: inspect the object, place it in your space, and decide with better information.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-control border border-line bg-panel-soft text-muted transition-colors hover:border-electric/40 hover:text-electric"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore" links={quickLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <div>
            <h2 className="text-sm font-semibold text-paper">A better way to decide</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Browse the catalog and use 3D or AR when you need more evidence before buying.
            </p>
            <Link href="/products" className="mt-5 inline-flex text-sm font-medium text-electric transition-colors hover:text-primary-light">
              Explore the catalog
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>&copy; {new Date().getFullYear()} NeoVerse Store. All rights reserved.</p>
          <p>Designed for confidence before checkout.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-paper">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted transition-colors hover:text-paper">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
