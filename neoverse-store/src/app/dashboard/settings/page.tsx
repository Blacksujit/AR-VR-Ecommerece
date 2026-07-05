'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api, type ApiResponse } from '@/lib/api'
import type { UserPreferences } from '@/types'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Moon, Bell, Globe, DollarSign, LogOut, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const currencies = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
]

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const { data: prefsRes } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => api.get<ApiResponse<UserPreferences>>('/user/preferences'),
    enabled: !!user,
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserPreferences>) =>
      api.patch<ApiResponse<UserPreferences>>('/user/preferences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const prefs = prefsRes?.data
  if (!prefs) return null

  const toggle = (key: string, value: boolean) => {
    updateMutation.mutate({ [key]: value } as any)
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-white/40 mt-1">Customize your experience</p>
      </div>

      <Card className="p-6 space-y-6">
        <h3 className="font-semibold flex items-center gap-2"><Moon className="w-4 h-4 text-primary" /> Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Dark Mode</p>
              <p className="text-xs text-white/40">Use dark theme across the store</p>
            </div>
            <button
              onClick={() => toggle('darkMode', !prefs.darkMode)}
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                prefs.darkMode ? 'bg-primary' : 'bg-white/10'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                prefs.darkMode ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h3 className="font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-accent" /> Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive order updates and promotions via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get push notifications for order updates' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key, !(prefs as any)[key])}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  (prefs as any)[key] ? 'bg-accent' : 'bg-white/10'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                  (prefs as any)[key] ? 'translate-x-6' : 'translate-x-0.5'
                )} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /></div>
        <h3 className="font-semibold">Localization</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">Language</label>
            <select
              value={prefs.language}
              onChange={(e) => updateMutation.mutate({ language: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#050816]">{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">
              <DollarSign className="w-3 h-3 inline mr-1" />
              Currency
            </label>
            <select
              value={prefs.currency}
              onChange={(e) => updateMutation.mutate({ currency: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#050816]">{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6 border-error/20">
        <h3 className="font-semibold flex items-center gap-2 text-error"><LogOut className="w-4 h-4" /> Account</h3>
        <div className="space-y-3">
          <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-error/10">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
          <Button onClick={() => { if (confirm('Are you sure? This action cannot be undone.')) api.delete('/user/profile').then(() => handleSignOut()) }} variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-error/10">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </Card>

      {updateMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-primary"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</div>
      )}
    </div>
  )
}
