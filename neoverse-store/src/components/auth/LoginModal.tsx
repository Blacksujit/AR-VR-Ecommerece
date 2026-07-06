'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import { Mail, Lock, Eye, EyeOff, Globe, Phone } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [form, setForm] = useState<LoginInput>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [phoneMode, setPhoneMode] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  const handleChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      onClose()
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string }
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        setApiError('Invalid email or password.')
      } else if (e.code === 'auth/invalid-email') {
        setApiError('Please provide a valid email address.')
      } else if (e.code === 'auth/user-disabled') {
        setApiError('This account has been disabled.')
      } else if (e.code === 'auth/too-many-requests') {
        setApiError('Too many attempts. Please try again later.')
      } else {
        setApiError(e.message || 'An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setApiError('')
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
      onClose()
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code !== 'auth/popup-closed-by-user') {
        setApiError('Google sign-in failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const setupRecaptcha = () => {
    if (!(window as unknown as Record<string, unknown>).recaptchaVerifier) {
      ;(window as unknown as Record<string, unknown>).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    return (window as unknown as Record<string, unknown>).recaptchaVerifier as RecaptchaVerifier
  }

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setApiError('Please enter a valid phone number.')
      return
    }
    setIsLoading(true)
    setApiError('')
    try {
      const verifier = setupRecaptcha()
      const result = await signInWithPhoneNumber(auth, phone, verifier)
      setConfirmationResult(result)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e.message || 'Failed to send OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setApiError('Please enter the OTP.')
      return
    }
    setIsLoading(true)
    setApiError('')
    try {
      await confirmationResult!.confirm(otp)
      onClose()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e.message || 'Invalid OTP.')
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
              <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
              <p className="text-white/60 mt-2">Sign in to your NeoVerse account</p>
            </div>

            <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => { setPhoneMode(false); setApiError('') }}
                className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${!phoneMode ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
              >
                Email / Google
              </button>
              <button
                onClick={() => { setPhoneMode(true); setApiError('') }}
                className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${phoneMode ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
              >
                Phone
              </button>
            </div>

            {apiError && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-4">
                {apiError}
              </div>
            )}

            {!phoneMode ? (
              <>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
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

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#050816] px-4 text-sm text-white/40">or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Google
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {!confirmationResult ? (
                  <>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      icon={<Phone className="w-4 h-4" />}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setApiError('') }}
                      required
                    />
                    <div id="recaptcha-container" />
                    <Button className="w-full" size="lg" onClick={handleSendOtp} disabled={isLoading}>
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      label="OTP Code"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setApiError('') }}
                      required
                    />
                    <Button className="w-full" size="lg" onClick={handleVerifyOtp} disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                    <button
                      onClick={() => { setConfirmationResult(null); setOtp('') }}
                      className="w-full text-sm text-primary hover:underline"
                    >
                      Change phone number
                    </button>
                  </>
                )}
              </div>
            )}

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
