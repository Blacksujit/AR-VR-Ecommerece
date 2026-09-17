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

  const normalizedSrc = src?.trim() || ''
  const isLocalSource = normalizedSrc.startsWith('/')
  const isRemoteSource = /^https:\/\//i.test(normalizedSrc)
  const isUsableSource = Boolean(normalizedSrc) && (isLocalSource || isRemoteSource)

  if (!isUsableSource || error) {
    return (
      <div
        className={cn(
          'flex min-h-24 items-center justify-center bg-panel-soft px-4 text-center text-muted',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        aria-label={alt}
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] select-none">
          Product image unavailable
        </span>
      </div>
    )
  }

  const imgProps = {
    src: normalizedSrc,
    alt,
    className: cn(
      'object-cover transition-opacity duration-200',
      loaded ? 'opacity-100' : 'opacity-90',
      className
    ),
    onLoad: () => setLoaded(true),
    onError: () => setError(true),
    priority,
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    unoptimized: process.env.NODE_ENV === 'development' || isLocalSource,
  }

  if (fill) {
    return (
      <>
        <Image {...imgProps} fill />
      </>
    )
  }

  return (
    <>
      <Image {...imgProps} width={width} height={height} />
    </>
  )
}
