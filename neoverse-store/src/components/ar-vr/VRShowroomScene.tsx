'use client'
import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Text, Center, Html } from '@react-three/drei'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api, type ApiResponse } from '@/lib/api'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { cn, formatPrice } from '@/lib/utils'
import { Music, ShoppingCart, Eye, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Mesh, Group, type MeshStandardMaterial } from 'three'

const CATEGORY_COLORS: Record<string, string> = {
  'Gaming': '#5b7fff',
  'Audio': '#00e5ff',
  'Wearables': '#8b5cf6',
  'Smart Home': '#22c55e',
  'Photography': '#f59e0b',
  'Computing': '#ef4444',
}

function getColor(product: Product): string {
  return CATEGORY_COLORS[product.category] || '#5b7fff'
}

function ProductGeometry({ category, color }: { category: string; color: string }) {
  const meshRef = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3
  })

  const geo = (() => {
    switch (category) {
      case 'Gaming': return <boxGeometry args={[0.8, 0.8, 0.8]} />
      case 'Audio': return <sphereGeometry args={[0.5, 32, 32]} />
      case 'Wearables': return <torusKnotGeometry args={[0.4, 0.15, 64, 16]} />
      case 'Smart Home': return <cylinderGeometry args={[0.3, 0.5, 0.8, 32]} />
      case 'Photography': return <dodecahedronGeometry args={[0.5]} />
      default: return <icosahedronGeometry args={[0.5]} />
    }
  })()

  return (
    <mesh ref={meshRef}>
      {geo}
      <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.2} clearcoat={0.4} />
    </mesh>
  )
}

function ShowroomProduct({ product, position }: { product: Product; position: [number, number, number] }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const color = getColor(product)

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
      <group position={position}>
        <ProductGeometry category={product.category} color={color} />
        <Center position={[0, -0.8, 0]}>
          <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle" fillOpacity={0.8}>
            {product.name}
          </Text>
        </Center>
        <Center position={[0, -1.0, 0]}>
          <Text fontSize={0.08} color="#5b7fff" anchorX="center" anchorY="middle" fillOpacity={0.9}>
            {formatPrice(product.price)}
          </Text>
        </Center>
        <Html position={[0, -1.3, 0]} center>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => router.push(`/products/${product.slug}`)}
              className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 backdrop-blur-sm"
              title="View details"
            >
              <Eye className="h-3 w-3" />
            </button>
            <button
              onClick={() => { addItem(product); toast.success(`Added ${product.name}`) }}
              className="rounded-lg bg-primary/20 p-1.5 text-primary hover:bg-primary/30 backdrop-blur-sm"
              title="Add to cart"
            >
              <ShoppingCart className="h-3 w-3" />
            </button>
          </div>
        </Html>
      </group>
    </Float>
  )
}

function ShowroomFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[12, 8]} />
      <meshPhysicalMaterial color="#050816" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
    </mesh>
  )
}

function ShowroomLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={30} color="#5b7fff" />
      <pointLight position={[-3, 3, -2]} intensity={20} color="#00e5ff" />
      <pointLight position={[3, 3, 2]} intensity={20} color="#8b5cf6" />
    </>
  )
}

function ShowroomContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'vr'],
    queryFn: () => api.get<ApiResponse<Product[]>>('/products?limit=10'),
  })

  if (isLoading) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#5B7FFF]" />
          <span className="text-xs text-gray-400">Loading showroom...</span>
        </div>
      </Html>
    )
  }

  const products = (data?.data || []).slice(0, 8)
  const positions: [number, number, number][] = [
    [-3, 1, 0], [0, 1, 0], [3, 1, 0],
    [-1.5, 1, 2.5], [1.5, 1, 2.5],
    [-3, 1, -2], [0, 1, -2], [3, 1, -2],
  ]

  return (
    <group>
      <ShowroomLights />
      <ShowroomFloor />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={3} />
      {products.map((product, i) => (
        <ShowroomProduct key={product._id} product={product} position={positions[i] || [0, 1, 0]} />
      ))}
      <Environment preset="night" />
    </group>
  )
}

export function VRShowroomScene() {
  const [musicOn, setMusicOn] = useState(false)

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 3, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ShowroomContent />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4">
        <div className="glass px-4 py-2 rounded-xl">
          <p className="text-sm font-medium">VR Showroom</p>
          <p className="text-xs text-white/40">Drag to explore · Scroll to zoom</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setMusicOn(!musicOn)}
          className={cn('p-3 glass rounded-xl transition-all', musicOn && 'bg-primary/20')}
        >
          <Music className={cn('w-5 h-5', musicOn && 'text-primary')} />
        </button>
      </div>
    </div>
  )
}
