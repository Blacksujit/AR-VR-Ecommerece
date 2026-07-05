'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, type ApiResponse } from '@/lib/api'
import type { User, UserPreferences } from '@/types'
import { Camera, Loader2, Save, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)

  const { data: prefsRes } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => api.get<ApiResponse<UserPreferences>>('/user/preferences'),
    enabled: !!user,
  })
  const preferences = prefsRes?.data

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      api.patch<ApiResponse<User>>('/user/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const handleSave = () => {
    updateMutation.mutate({ name, phone })
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Profile</h1>
        <p className="text-white/40 mt-1">Manage your personal information</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-6 border-b border-white/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-3xl font-bold text-white">{user.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-white/40">{user.email}</p>
            <p className="text-xs text-white/30 mt-1">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">Email</label>
            <Input value={user.email} disabled className="opacity-50" />
            <p className="text-xs text-white/30 mt-1">Email is managed by your authentication provider</p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 mb-1.5 block">Role</label>
            <Input value={user.role || 'user'} disabled className="opacity-50 capitalize" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave} disabled={updateMutation.isPending} variant="primary">
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
          {preferences?.darkMode !== undefined && (
            <span className="text-xs text-white/30">
              Preferences: {preferences.darkMode ? 'Dark' : 'Light'} mode
            </span>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-2">Account Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/40">User ID</span>
            <p className="font-mono text-xs truncate">{user._id}</p>
          </div>
          <div>
            <span className="text-white/40">Account Created</span>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-white/40">Last Updated</span>
            <p>{new Date(user.updatedAt || user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-white/40">Addresses</span>
            <p>{user.addresses?.length || 0} saved</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
