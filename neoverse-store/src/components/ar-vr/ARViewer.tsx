'use client'

import { useState, useEffect } from 'react'
import { Loader2, Maximize2, X, Smartphone } from 'lucide-react'

interface ARViewerProps {
  modelUrl?: string
  productName: string
  poster?: string
}

export default function ARViewer({ modelUrl, productName, poster }: ARViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [supported, setSupported] = useState<'webxr' | 'scene-viewer' | 'quick-look' | null>(null)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then(supported => {
        if (supported) {
          setSupported('webxr')
          return
        }
      }).catch(() => {})
    }

    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isAndroid) {
      setSupported('scene-viewer')
    } else if (isIOS) {
      setSupported('quick-look')
    } else {
      setSupported(null)
    }
  }, [])

  if (!modelUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
        <Smartphone className="mb-2 h-8 w-8 text-gray-500" />
        <p className="text-sm text-gray-400">3D model not available for AR</p>
      </div>
    )
  }

  const openAR = () => {
    if (!modelUrl) return

    if (supported === 'scene-viewer') {
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        modelUrl
      )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;end;`
      window.location.href = intentUrl
    } else if (supported === 'quick-look') {
      const relUrl = modelUrl.endsWith('.usdz')
        ? modelUrl
        : modelUrl.replace(/\.glb$/, '.usdz').replace(/\.gltf$/, '.usdz')
      const quickLookUrl = `https://modelviewer.dev/examples/quicklook.html?url=${encodeURIComponent(relUrl)}`
      window.location.href = quickLookUrl
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={openAR}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B7FFF] to-[#8B5CF6] px-4 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Smartphone className="h-4 w-4" />
        View in Your Space
        {supported && (
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
            {supported === 'webxr' ? 'WebXR' : supported === 'scene-viewer' ? 'ARCore' : 'AR Quick Look'}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close AR Viewer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-full w-full max-h-screen">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5B7FFF]" />
              </div>
            )}
            {/* @ts-expect-error model-viewer is a web component loaded at runtime */}
            <model-viewer
              src={modelUrl}
              alt={`AR view of ${productName}`}
              poster={poster || ''}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              auto-rotate
              style={{ width: '100%', height: '100%' }}
              onLoad={() => setIsLoading(false)}
            />
            {!isLoading && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                Move, rotate, and scale with your fingers
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
