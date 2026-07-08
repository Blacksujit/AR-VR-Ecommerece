'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  aspectRatio?: string
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  aspectRatio,
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-white/5',
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <span className="text-4xl font-display font-bold text-white/20">
          {alt.charAt(0).toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : (width || 400)}
        height={fill ? undefined : (height || 400)}
        fill={fill}
        className={cn(
          'object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        priority={priority}
        sizes={sizes}
        unoptimized={process.env.NODE_ENV === 'development'}
      />
    </div>
  )
}
