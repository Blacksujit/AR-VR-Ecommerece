'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  products?: Array<{
    _id: string
    name: string
    slug: string
    price: number
    discount: number
    images: string[]
    rating: number
  }>
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI shopping assistant. Ask me anything about our products — I can help you find items, compare specs, recommend gifts, and more!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = async () => {
    const message = input.trim()
    if (!message || isLoading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    try {
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }))
      const res = await api.post<{
        success: boolean
        data: { response: string; products: ChatMessage['products'] }
      }>('/ai/chat', { message, history })

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.response,
          products: res.data.products,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#5B7FFF] text-white shadow-lg shadow-[#5B7FFF]/25 transition-all hover:bg-[#4A6FE0] hover:scale-105 active:scale-95"
        aria-label="Open AI Shopping Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-white/10 bg-[#0a0a1a] shadow-2xl"
            style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B7FFF]/20">
                  <Bot className="h-4 w-4 text-[#5B7FFF]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                  <p className="text-[10px] text-gray-400">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
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
                        ? 'bg-[#5B7FFF] text-white'
                        : 'bg-white/5 text-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === 'assistant' && (
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5B7FFF]" />
                      )}
                      <div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {msg.products && msg.products.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {msg.products.slice(0, 3).map(product => (
                              <a
                                key={product._id}
                                href={`/products/${product.slug}`}
                                className="flex items-center gap-2 rounded-lg bg-white/10 p-2 text-xs transition-colors hover:bg-white/20"
                              >
                                {product.images?.[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">{product.name}</p>
                                  <p className="text-gray-400">
                                    ${product.discount > 0
                                      ? (product.price * (1 - product.discount / 100)).toFixed(2)
                                      : product.price.toFixed(2)}
                                    {product.discount > 0 && (
                                      <span className="ml-1 text-green-400">-{product.discount}%</span>
                                    )}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#5B7FFF]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#5B7FFF]/50"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B7FFF] text-white transition-all hover:bg-[#4A6FE0] disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
