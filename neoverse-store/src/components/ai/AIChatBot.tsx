'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useUIStore } from '@/store/ui-store'


interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  products?: Array<{
    _id: string
    name: string
    slug: string
    price: number
    discount: number
    originalPrice?: number
    currentPrice?: number
    images: string[]
    rating: number
    stock?: number
    availability?: string
    brand?: string
    capabilities?: {
      model3d?: boolean
      ar?: boolean
      vr?: boolean
    }
    specifications?: Array<{ name?: string; value?: string }>
    recommended?: boolean
  }>
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Tell me what you are trying to decide. I can compare products, explain available specifications, and point you to AR or 3D inspection when the catalog supports it.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastIntent, setLastIntent] = useState<string | null>(null)
  const quickPrompts = [
    'Compare the best available options',
    'What is the best value under $100?',
    'Which products support 3D or AR inspection?',
  ]
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isCartOpen } = useUIStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])


  const openAssistant = () => {
    if (!isCartOpen) setIsOpen(true)
  }

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await api.post<{ success: boolean; data: { response: string; intent?: { intent?: string }; products?: ChatMessage['products'] } }>(
        '/ai/chat',
        {
          message: userMessage,
          history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
        }
      )
      setLastIntent(res.data.intent?.intent || null)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.response, products: res.data.products },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't process your request. Please try again or contact support." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    await sendMessage(input.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {!isCartOpen && (
        <button
          onClick={openAssistant}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95"
          aria-label="Open AI Shopping Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-glass-border bg-background/95 backdrop-blur-xl shadow-2xl"
            style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                  <p className="text-[10px] text-muted">Catalog guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-white/90'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === 'assistant' && (
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                      <div>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.products && msg.products.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {msg.products.map((p) => (
                              <a
                                key={p._id}
                                href={`/products/${p.slug}`}
                                className="block rounded-control border border-line bg-panel-soft p-3 transition-colors hover:border-electric/60"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-xs font-medium text-paper">{p.name}</p>
                                  {p.recommended && <span className="shrink-0 text-[10px] text-accent">Match</span>}
                                </div>
                                <p className="mt-1 text-xs text-electric">
                                  ${(p.currentPrice ?? p.price).toFixed(2)}
                                  {p.originalPrice && p.originalPrice > (p.currentPrice ?? p.price) && (
                                    <span className="ml-1 text-faint line-through">${p.originalPrice.toFixed(2)}</span>
                                  )}
                                </p>
                                <p className="mt-1 text-[11px] text-muted">
                                  {p.availability || 'Availability not provided'} · {p.rating ? `${p.rating}/5 rating` : 'Rating not provided'}
                                </p>
                                {(p.capabilities?.model3d || p.capabilities?.ar || p.capabilities?.vr) && (
                                  <p className="mt-1 text-[11px] text-electric-strong">Inspection: {[p.capabilities.model3d && '3D', p.capabilities.ar && 'AR', p.capabilities.vr && 'VR'].filter(Boolean).join(' · ')}</p>
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 1 && !isLoading && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-line bg-panel-soft px-3 py-2 text-left text-[11px] text-muted transition-colors hover:border-electric/60 hover:text-paper"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              {lastIntent && !isLoading && (
                <p className="text-[10px] text-faint">Using catalog filter: {lastIntent}</p>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-sm text-white/60">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 border border-white/10">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                  aria-label="Chat message"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-1.5 text-center">
                Product details come from the current catalog. Confirm final price at checkout.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
