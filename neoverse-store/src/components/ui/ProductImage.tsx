'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src?: string
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
  sizes,
  aspectRatio,
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-white/5 text-white/30',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        aria-label={alt}
      >
        <span className="text-2xl font-bold select-none">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  const imgProps = {
    src,
    alt,
    className: cn(
      'object-cover transition-opacity duration-300',
      loaded ? 'opacity-100' : 'opacity-0',
      className
    ),
    onLoadingComplete: () => setLoaded(true),
    onError: () => setError(true),
    priority,
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    unoptimized: process.env.NODE_ENV === 'development',
  }

  if (fill) {
    return (
      <>
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        )}
        <Image {...imgProps} fill />
      </>
    )
  }

  return (
    <>
      {!loaded && (
        <div
          className="animate-pulse bg-white/5"
          style={{ width, height, aspectRatio }}
        />
      )}
      <Image {...imgProps} width={width} height={height} />
    </>
  )
}
