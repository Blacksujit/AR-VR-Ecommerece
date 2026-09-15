'use client'

import { useRef, useCallback, useState } from 'react'
import { Search, Mic, MicOff, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  currentSortLabel: string
  sortDropdownOpen: boolean
  onToggleSort: () => void
  sortOptions: readonly { label: string; value: string }[]
  sort: string
  onSortChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onOpenMobileFilters: () => void
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  currentSortLabel,
  sortDropdownOpen,
  onToggleSort,
  sortOptions,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
}: SearchBarProps) {
  const [isListening, setIsListening] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleVoiceSearch = useCallback(() => {
    if (isListening) return
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) {
      return
    }
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    setIsListening(true)
    recognition.onresult = (e: { results: { transcript: string }[][] }) => {
      const transcript = e.results[0][0].transcript
      onSearchChange(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }, [isListening, onSearchChange])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          aria-label="Search products"
        />
        <button
          onClick={handleVoiceSearch}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 transition-colors',
            isListening ? 'text-error' : 'text-white/30 hover:text-primary'
          )}
          aria-label={isListening ? 'Listening...' : 'Voice search'}
          title={isListening ? 'Listening...' : 'Search by voice'}
        >
          {isListening ? (
            <span className="relative flex items-center justify-center">
              <MicOff className="w-4 h-4" />
              <span className="absolute inset-0 animate-ping rounded-full bg-error/30" />
            </span>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 left-0 right-0 glass rounded-xl px-4 py-3 text-sm text-primary-light border border-primary/20 z-20"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
              </span>
              Listening... speak now
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={onToggleSort}
            className="w-full sm:w-44 flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white transition-colors"
          >
            <span className="truncate">{currentSortLabel}</span>
            <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', sortDropdownOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {sortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 right-0 w-full min-w-[200px] glass border border-glass-border rounded-xl py-2 z-30 shadow-soft"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { onSortChange(option.value); onToggleSort() }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      sort === option.value
                        ? 'text-primary bg-primary/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center glass rounded-xl border border-glass-border p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white')}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white')}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
