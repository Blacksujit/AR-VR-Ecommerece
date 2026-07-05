'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { cn } from '@/lib/utils'
import { X, Menu, LayoutDashboard, ShoppingBag, Heart, Clock, MapPin, Bell, Settings, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: ShoppingBag, label: 'Cart', href: '/cart' },
  { icon: Clock, label: 'Recently Viewed', href: '/dashboard/recently-viewed' },
  { icon: MapPin, label: 'Addresses', href: '/dashboard/addresses' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout: signOutUser } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center"
        aria-label="Open dashboard menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full glass border-r border-white/10 overflow-y-auto"
            >
              <MobileSidebarContent
                user={user}
                pathname={pathname}
                onNavigate={(href) => { setMobileOpen(false); router.push(href) }}
                onLogout={() => { setMobileOpen(false); signOutUser() }}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block w-64 shrink-0">
        <DesktopSidebarContent user={user} pathname={pathname} onLogout={() => signOutUser()} />
      </aside>
    </>
  )
}

function DesktopSidebarContent({ user, pathname, onLogout }: { user: any; pathname: string; onLogout: () => void }) {
  return (
    <div className="h-full glass rounded-2xl border border-white/10 p-4 flex flex-col gap-1 sticky top-24">
      <div className="text-center pb-4 mb-2 border-b border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
          <span className="text-xl font-bold text-white">{user?.name?.charAt(0) || '?'}</span>
        </div>
        <h3 className="font-semibold text-sm truncate">{user?.name || 'User'}</h3>
        <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error/70 hover:text-error hover:bg-error/5 transition-all mt-2"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign Out
      </button>
    </div>
  )
}

function MobileSidebarContent({
  user, pathname, onNavigate, onLogout, onClose,
}: {
  user: any; pathname: string; onNavigate: (href: string) => void; onLogout: () => void; onClose: () => void
}) {
  return (
    <div className="h-full p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/10">
        <span className="font-display font-bold text-lg gradient-text">NeoVerse</span>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors" aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || '?'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <button
              key={href}
              onClick={() => onNavigate(href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          )
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error/70 hover:text-error hover:bg-error/5 transition-all mt-2"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign Out
      </button>
    </div>
  )
}
