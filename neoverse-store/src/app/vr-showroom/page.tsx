import { Suspense } from 'react'
import VRShowroomWrapper from './VRShowroomWrapper'

export const metadata = {
  title: 'VR Showroom | NeoVerse Store',
}

export default function VRShowroomPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Virtual Reality Showroom</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experience our products in an immersive 3D environment
          </p>
        </div>

        <Suspense fallback={<div className="h-[600px] rounded-2xl bg-white/5 animate-pulse" />}>
          <VRShowroomWrapper />
        </Suspense>
      </div>
    </div>
  )
}
