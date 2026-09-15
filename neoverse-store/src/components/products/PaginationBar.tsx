'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationBarProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl glass border border-glass-border text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'w-10 h-10 rounded-xl text-sm font-medium transition-all',
            page === currentPage
              ? 'bg-primary text-white shadow-glow'
              : 'glass border border-glass-border text-white/60 hover:text-white'
          )}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl glass border border-glass-border text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
