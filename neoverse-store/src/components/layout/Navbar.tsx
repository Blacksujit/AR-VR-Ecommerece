'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Search, Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { cn, getInitials } from '@/lib/utils'
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
  const { isSearchOpen, isMobileMenuOpen, toggleSearch, toggleMobileMenu, closeAll } =
    useUIStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = () => {
    if (isMobileMenuOpen) toggleMobileMenu()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-glass-border shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={handleLinkClick}
          >
            <span className="text-2xl font-bold tracking-tight gradient-text font-display">
              NeoVerse
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)] rounded-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-glass-hover transition-colors"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-glass-hover transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-glass-hover transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                  aria-label="User menu"
                >
                  {getInitials(user.name)}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass border border-glass-border rounded-xl shadow-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 backdrop-blur-xl">
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
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-2 text-sm font-medium text-foreground border border-glass-border hover:bg-glass-hover rounded-xl transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-glass-hover transition-colors"
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
            className="lg:hidden glass border-t border-glass-border overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-glass-hover rounded-xl transition-colors"
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
                    className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-glass-hover rounded-xl transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-glass-hover rounded-xl transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); toggleMobileMenu() }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-error/80 hover:text-error hover:bg-error/5 rounded-xl transition-colors"
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
