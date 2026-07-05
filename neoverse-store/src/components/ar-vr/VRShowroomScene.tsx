'use client'
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Text, Center } from '@react-three/drei'
import { cn } from '@/lib/utils'
import { Music } from 'lucide-react'

interface ShowroomProduct {
  position: [number, number, number]
  color: string
  label: string
}

const products: ShowroomProduct[] = [
  { position: [-2.5, 1, 0], color: '#5b7fff', label: 'Gaming Chair' },
  { position: [0, 1, 0], color: '#00e5ff', label: 'VR Headset' },
  { position: [2.5, 1, 0], color: '#8b5cf6', label: 'Smart Watch' },
  { position: [-1.25, 1, 2], color: '#22c55e', label: 'Headphones' },
  { position: [1.25, 1, 2], color: '#f59e0b', label: 'Drone' },
]

function FloatingProduct({ position, color, label }: ShowroomProduct) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.2} clearcoat={0.4} />
        </mesh>
        <Center position={[0, -0.7, 0]}>
          <Text
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.8}
          >
            {label}
          </Text>
        </Center>
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

export function VRShowroomScene() {
  const [musicOn, setMusicOn] = useState(false)

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 3, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ShowroomLights />
          <ShowroomFloor />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={3} />

          {products.map((product, i) => (
            <FloatingProduct key={i} {...product} />
          ))}

          <Environment preset="night" />
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
