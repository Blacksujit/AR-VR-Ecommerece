'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterInput } from '@/schemas/auth'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [form, setForm] = useState<RegisterInput>({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(userCredential.user, { displayName: form.name })
      onClose()
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string }
      if (e.code === 'auth/email-already-in-use') {
        setApiError('An account with this email already exists.')
      } else if (e.code === 'auth/weak-password') {
        setApiError('Password is too weak. Use at least 6 characters.')
      } else if (e.code === 'auth/invalid-email') {
        setApiError('Please provide a valid email address.')
      } else if (e.code === 'auth/too-many-requests') {
        setApiError('Too many attempts. Please try again later.')
      } else {
        setApiError(e.message || 'An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative glass rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold">Create Account</h2>
              <p className="text-white/60 mt-2">Join the NeoVerse community</p>
            </div>

            {apiError && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-4">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
                {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    icon={<Lock className="w-4 h-4" />}
                    value={form.password}
                    onChange={handleChange('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  icon={<Lock className="w-4 h-4" />}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                />
                {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <p className="text-xs text-white/40 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
