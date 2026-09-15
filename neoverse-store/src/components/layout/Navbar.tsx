'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Search, Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { cn, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { useAuth } from '@/components/auth/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { user, logout } = useAuth()
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
  const { isMobileMenuOpen, toggleSearch, toggleMobileMenu } = useUIStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const menu = mobileMenuRef.current
    if (!menu) return
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    menu.addEventListener('keydown', trap)
    first?.focus()
    return () => menu.removeEventListener('keydown', trap)
  }, [isMobileMenuOpen])

  const handleLinkClick = () => {
    if (isMobileMenuOpen) toggleMobileMenu()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-ink/90 shadow-soft backdrop-blur-xl'
          : 'bg-ink/70 backdrop-blur-md'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={handleLinkClick}
          >
            <span className="text-xl font-semibold tracking-[-0.03em] text-paper font-display">
              NeoVerse<span className="text-electric">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-muted hover:text-paper transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-3 right-3 h-px origin-left scale-x-0 bg-electric transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-control text-muted hover:bg-panel-soft hover:text-paper transition-colors"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative flex min-h-10 min-w-10 items-center justify-center rounded-control text-muted hover:bg-panel-soft hover:text-paper transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative flex min-h-10 min-w-10 items-center justify-center rounded-control text-muted hover:bg-panel-soft hover:text-paper transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-electric px-1 text-[10px] font-bold text-ink"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-sm font-semibold text-electric hover:bg-electric/20 transition-colors"
                  aria-label="User menu"
                >
                  {getInitials(user.name)}
                </button>
                <div className="invisible absolute right-0 top-full mt-2 w-48 translate-y-1 rounded-control border border-line bg-panel/95 opacity-0 shadow-elevated backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-glass-hover transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-glass-hover transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <hr className="my-1 border-glass-border" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error/80 hover:text-error hover:bg-error/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowRegister(true)}>
                  Get Started
                </Button>
                <Button size="sm" onClick={() => setShowLogin(true)}>
                  Sign In
                </Button>
              </div>
            )}

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex min-h-10 min-w-10 items-center justify-center rounded-control text-muted hover:bg-panel-soft hover:text-paper transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            ref={mobileMenuRef}
            className="lg:hidden border-t border-line bg-panel/95 overflow-hidden backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block rounded-control px-4 py-3 text-sm font-medium text-muted hover:bg-panel-soft hover:text-paper transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-glass-border" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="block rounded-control px-4 py-3 text-sm font-medium text-muted hover:bg-panel-soft hover:text-paper transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={handleLinkClick}
                      className="block rounded-control px-4 py-3 text-sm font-medium text-muted hover:bg-panel-soft hover:text-paper transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); toggleMobileMenu() }}
                    className="flex w-full items-center gap-2 rounded-control px-4 py-3 text-sm font-medium text-error/80 hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => { toggleMobileMenu(); setShowLogin(true) }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { toggleMobileMenu(); setShowRegister(true) }}
                    className="w-full px-4 py-3 text-sm font-medium text-foreground border border-glass-border hover:bg-glass-hover rounded-xl transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true) }} />
    </motion.nav>
  )
}
