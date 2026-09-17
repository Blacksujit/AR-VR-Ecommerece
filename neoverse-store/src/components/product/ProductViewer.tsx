'use client'

import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Html, useProgress, useGLTF } from '@react-three/drei'
import { Group } from 'three'
import { Loader2, Minimize2, RotateCcw, Expand, Image as ImageIcon, Ruler, AlertTriangle } from 'lucide-react'

function isGlbModel(url?: string | null): url is string {
  return !!url && /^https:\/\//i.test(url) && /\.(glb|gltf)(?:[?#].*)?$/i.test(url)
}

function ModelViewer({ modelUrl, autoRotate = true, onError }: { modelUrl: string; autoRotate?: boolean; onError: () => void }) {
  const meshRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) meshRef.current.rotation.y += delta * 0.15
  })

  return (
    <Suspense fallback={<Loader />}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      <group ref={meshRef}>
        <GLTFModel url={modelUrl} onError={onError} />
      </group>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
      />
    </Suspense>
  )
}

function GLTFModel({ url, onError }: { url: string; onError: () => void }) {
  try {
    const { scene } = useGLTF(url)
    return <primitive object={scene} scale={1} />
  } catch {
    onError()
    return null
  }
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5B7FFF]" />
        <span className="text-xs text-gray-400">Loading verified model · {progress.toFixed(0)}%</span>
      </div>
    </Html>
  )
}

interface ProductViewerProps {
  modelUrl?: string | null
  modelUsdzUrl?: string | null
  isARSupported?: boolean
  isVRSupported?: boolean
  productName: string
  imageUrl?: string
  specifications?: { key: string; value: string }[]
}

export default function ProductViewer({ modelUrl, modelUsdzUrl, isARSupported = false, isVRSupported = false, productName, imageUrl, specifications = [] }: ProductViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modelError, setModelError] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasModel = isGlbModel(modelUrl)
  const hasArAsset = Boolean(isARSupported && hasModel && modelUsdzUrl && /^https:\/\//i.test(modelUsdzUrl) && /\.usdz(?:[?#].*)?$/i.test(modelUsdzUrl))
  const inspectionModes = [hasModel && '3D', hasArAsset && 'AR', hasModel && isVRSupported && 'VR'].filter(Boolean)

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (!hasModel || modelError) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
          {imageUrl ? (
            <img src={imageUrl} alt={productName} className="h-full w-full object-contain p-8" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white/40">
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">No product media available</span>
            </div>
          )}
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur">
            {modelError ? '3D asset unavailable' : 'Image inspection'}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="flex items-center gap-2">
              {modelError && <AlertTriangle className="h-4 w-4 text-amber-300" />}
              <h4 className="text-sm font-medium text-white">Verified 3D inspection is not available</h4>
            </div>
            <p className="mt-1 text-xs leading-5 text-white/50">
                {modelError ? 'The verified model could not be loaded. The product image and specifications remain available.' : 'We only enable 3D and AR when this product has a verified model asset. Nothing here is a generic substitute for the real product.'}
              </p>
          </div>
          {specifications.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-black/10 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/70">
                <Ruler className="h-3.5 w-3.5" /> Available inspection details
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {specifications.slice(0, 4).map((spec) => (
                  <div key={spec.key} className="text-xs">
                    <span className="text-white/40">{spec.key}</span>
                    <span className="ml-2 text-white/80">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0a0a1a] to-[#12122a]"
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <ModelViewer modelUrl={modelUrl} autoRotate={autoRotate} onError={() => setModelError(true)} />
      </Canvas>
      <div className="absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
        Verified inspection: {inspectionModes.join(' · ')}
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button onClick={() => setAutoRotate(!autoRotate)} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-white/20">
          <RotateCcw className={`h-3 w-3 ${autoRotate ? 'text-[#5B7FFF]' : ''}`} />
          {autoRotate ? 'Auto' : 'Manual'}
        </button>
        <div className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm">Drag to rotate · Scroll to zoom</div>
      </div>
      <button onClick={toggleFullscreen} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
      </button>
    </div>
  )
}
