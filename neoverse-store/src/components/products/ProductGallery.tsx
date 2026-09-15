'use client'

import { useRef, useCallback } from 'react'
import { Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductImage } from '@/components/ui/ProductImage'

interface ProductGalleryProps {
  images: string[]
  name: string
  gradient: string
  selectedIndex: number
  onSelectImage: (index: number) => void
  children?: React.ReactNode
}

export function ProductGallery({ images, name, gradient, selectedIndex, onSelectImage, children }: ProductGalleryProps) {
  const imageRef = useRef<HTMLDivElement>(null)

  const handleFullscreen = useCallback(() => {
    if (imageRef.current?.requestFullscreen) {
      imageRef.current.requestFullscreen().catch(() => {})
    }
  }, [])

  return (
    <div ref={imageRef}>
      <div className={cn('relative aspect-square overflow-hidden rounded-media border border-line bg-linear-to-br', gradient)}>
        <ProductImage
          src={images?.[selectedIndex] || ''}
          alt={name}
          fill
          className="w-full h-full"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {children}
        <button onClick={handleFullscreen} className="absolute bottom-4 right-4 flex min-h-11 min-w-11 items-center justify-center rounded-control border border-white/15 bg-ink/70 text-paper backdrop-blur-sm transition-colors hover:bg-ink" aria-label="Fullscreen image">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => onSelectImage(i)}
            className={cn(
              'relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-control border-2 bg-panel-soft transition-all',
              selectedIndex === i ? 'border-electric' : 'border-transparent hover:border-border-hover'
            )}
            aria-label={`View image ${i + 1}`}
          >
            {images?.[i] ? (
              <ProductImage src={images[i]} alt="" fill sizes="80px" />
            ) : (
              <span className="font-display text-lg font-bold text-muted">{name.charAt(0)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
