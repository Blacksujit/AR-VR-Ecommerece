'use client'

import { useState, useEffect } from 'react'
import { Loader2, X, Smartphone } from 'lucide-react'

interface ARViewerProps {
  modelUrl?: string | null
  modelUsdzUrl?: string | null
  productName: string
  poster?: string
  arSupported?: boolean
}

function isGlbModel(url?: string | null): url is string {
  return !!url && /^https:\/\//i.test(url) && /\.(glb|gltf)(?:[?#].*)?$/i.test(url)
}

function isUsdzModel(url?: string | null): url is string {
  return !!url && /^https:\/\//i.test(url) && /\.usdz(?:[?#].*)?$/i.test(url)
}

export default function ARViewer({ modelUrl, modelUsdzUrl, productName, poster, arSupported = false }: ARViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [modelViewerReady, setModelViewerReady] = useState(false)
  const [supported, setSupported] = useState<'webxr' | 'scene-viewer' | 'quick-look' | null>(null)
  const hasGlb = isGlbModel(modelUrl)
  const hasUsdz = isUsdzModel(modelUsdzUrl)
  const canUseAR = arSupported && hasGlb

  useEffect(() => {
    if (!canUseAR) return
    let cancelled = false
    import('@google/model-viewer').then(() => {
      if (!cancelled) setModelViewerReady(true)
    })
    return () => { cancelled = true }
  }, [canUseAR])

  useEffect(() => {
    if (!canUseAR) return
    let cancelled = false
    const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent
    const fallback = /Android/i.test(userAgent)
      ? 'scene-viewer'
      : /iPhone|iPad|iPod/i.test(userAgent) && hasUsdz
        ? 'quick-look'
        : null

    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((isSupported) => {
        if (!cancelled && isSupported) setSupported('webxr')
        else if (!cancelled) setSupported(fallback)
      }).catch(() => { if (!cancelled) setSupported(fallback) })
    } else {
      const timer = window.setTimeout(() => { if (!cancelled) setSupported(fallback) }, 0)
      return () => { cancelled = true; window.clearTimeout(timer) }
    }
    return () => { cancelled = true }
  }, [canUseAR, hasUsdz])

  if (!canUseAR) return null

  const openAR = () => {
    if (!modelUrl || !modelViewerReady) return
    if (supported === 'scene-viewer') {
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;end;`
      window.location.href = intentUrl
    } else if (supported === 'quick-look' && modelUsdzUrl) {
      window.location.href = modelUsdzUrl
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <button onClick={openAR} disabled={!modelViewerReady} className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#5B7FFF] to-[#8B5CF6] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
        <Smartphone className="h-4 w-4" />
        View in your space
        {supported && modelViewerReady && <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">{supported === 'webxr' ? 'WebXR' : supported === 'scene-viewer' ? 'ARCore' : 'AR Quick Look'}</span>}
        {!modelViewerReady && <Loader2 className="h-4 w-4 animate-spin" aria-label="Preparing AR viewer" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90">
          <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Close AR Viewer">
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full max-h-screen">
            {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#5B7FFF]" /></div>}
            {/* @ts-expect-error model-viewer is a web component loaded at runtime */}
            <model-viewer src={modelUrl} ios-src={modelUsdzUrl || undefined} alt={`AR view of ${productName}`} poster={poster || ''} ar ar-modes="webxr scene-viewer quick-look" camera-controls auto-rotate style={{ width: '100%', height: '100%' }} onLoad={() => setIsLoading(false)} />
            {!isLoading && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">Move, rotate, and scale with your fingers</div>}
          </div>
        </div>
      )}
    </>
  )
}
