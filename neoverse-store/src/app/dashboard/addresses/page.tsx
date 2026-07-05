'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, type ApiResponse } from '@/lib/api'
import type { Address } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Pencil, Trash2, Check, Loader2, X } from 'lucide-react'

const emptyAddress = { fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false }

export default function AddressesPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyAddress)

  const { data: addressesRes, isLoading } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => api.get<ApiResponse<Address[]>>('/user/addresses'),
    enabled: !!user,
  })

  const addMutation = useMutation({
    mutationFn: (data: typeof emptyAddress) => api.post<ApiResponse<Address[]>>('/user/addresses', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-addresses'] }); setShowForm(false); setForm(emptyAddress); queryClient.invalidateQueries({ queryKey: ['current-user'] }) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof emptyAddress }) => api.put<ApiResponse<Address[]>>(`/user/addresses/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-addresses'] }); setEditingId(null); setForm(emptyAddress); queryClient.invalidateQueries({ queryKey: ['current-user'] }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/user/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-addresses'] }),
  })

  const addresses = addressesRes?.data ?? []

  const handleSubmit = () => {
    if (editingId) updateMutation.mutate({ id: editingId, data: form })
    else addMutation.mutate(form)
  }

  const startEdit = (addr: Address) => {
    setForm({ fullName: addr.fullName, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country, isDefault: addr.isDefault })
    setEditingId(addr._id)
    setShowForm(true)
  }

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(emptyAddress) }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Addresses</h1>
          <p className="text-white/40 mt-1">Manage your shipping and billing addresses</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">{editingId ? 'Edit Address' : 'New Address'}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Street Address" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="sm:col-span-2" />
                <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                <Input placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
                <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-white/20" />
                Set as default address
              </label>
              <div className="flex gap-3">
                <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Update' : 'Save'} Address
                </Button>
                <Button variant="ghost" onClick={cancelForm}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
          <p className="text-white/40 mb-6">Add a shipping address for faster checkout</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <motion.div key={addr._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 relative group hover:border-primary/30 transition-all">
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Default
                  </span>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{addr.fullName}</p>
                    <p className="text-xs text-white/40">{addr.phone}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60">{addr.street}</p>
                <p className="text-sm text-white/60">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-white/60">{addr.country}</p>
                <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                  <button onClick={() => startEdit(addr)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => deleteMutation.mutate(addr._id)} className="flex items-center gap-1 text-xs text-error hover:underline">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
