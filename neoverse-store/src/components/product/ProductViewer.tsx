'use client'

import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Html, useProgress, useGLTF } from '@react-three/drei'
import { Mesh, Group } from 'three'
import { Loader2, Maximize2, Minimize2, RotateCcw, Expand } from 'lucide-react'

function ModelViewer({ modelUrl, autoRotate = true }: { modelUrl: string; autoRotate?: boolean }) {
  const meshRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <Suspense fallback={<Loader />}>
      <ambientLight intensity={modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf') ? 0.5 : 0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      {!modelUrl.endsWith('.glb') && !modelUrl.endsWith('.gltf') && (
        <pointLight position={[0, 3, 0]} intensity={0.3} />
      )}
      <group ref={meshRef}>
        {modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf') ? (
          <GLTFModel url={modelUrl} />
        ) : (
          <FallbackModel />
        )}
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

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} />
}

function FallbackModel() {
  const groupRef = useRef<Group>(null)
  const innerRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + floatOffset.current) * 0.15
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.2
      innerRef.current.rotation.z += delta * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      ringRef.current.rotation.z += delta * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshPhysicalMaterial
          color="#5B7FFF"
          metalness={0.7}
          roughness={0.2}
          clearcoat={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh scale={[1.15, 1.15, 1.15]}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.015, 16, 64]} />
        <meshBasicMaterial color="#5B7FFF" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.01, 16, 64]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5B7FFF]" />
        <span className="text-xs text-gray-400">{progress.toFixed(0)}%</span>
      </div>
    </Html>
  )
}

interface ProductViewerProps {
  modelUrl?: string
  productName: string
}

export default function ProductViewer({ modelUrl, productName }: ProductViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a1a] to-[#12122a]"
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
        >
          <ModelViewer modelUrl={modelUrl || ''} autoRotate={autoRotate} />
      </Canvas>

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <RotateCcw className={`h-3 w-3 ${autoRotate ? 'text-[#5B7FFF]' : ''}`} />
          {autoRotate ? 'Auto' : 'Manual'}
        </button>
        <div className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm">
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      <button
        onClick={toggleFullscreen}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
      </button>
    </div>
  )
}
