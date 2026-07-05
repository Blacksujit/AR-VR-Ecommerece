'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSignIn } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { signIn, fetchStatus } = useSignIn()
  const [form, setForm] = useState<LoginInput>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [apiError, setApiError] = useState('')

  const handleChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    if (fetchStatus === 'fetching') return

    try {
      const { error: createError } = await signIn.create({ identifier: form.email, password: form.password })
      if (createError) {
        setApiError(createError.longMessage || createError.message)
        return
      }

      if (signIn.status !== 'complete') {
        setApiError('Additional verification required.')
        return
      }

      const { error: finalizeError } = await signIn.finalize()
      if (finalizeError) {
        setApiError(finalizeError.longMessage || finalizeError.message)
        return
      }

      onClose()
    } catch (err: unknown) {
      const e = err as { clerkError?: true; message?: string; longMessage?: string; errors?: Array<{ message: string; longMessage?: string }> }
      let msg = e?.longMessage || e?.message || 'An unexpected error occurred.'
      if (e?.errors?.[0]) {
        msg = e.errors[0].longMessage || e.errors[0].message || msg
      }
      setApiError(msg)
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
              <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
              <p className="text-white/60 mt-2">Sign in to your NeoVerse account</p>
            </div>

            {apiError && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-4">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
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

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Don&apos;t have an account?{' '}
              <button onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
                Sign up
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
