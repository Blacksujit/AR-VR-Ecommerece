import { Suspense } from 'react'
import VRShowroomWrapper from './VRShowroomWrapper'

export const metadata = {
  title: 'VR Showroom | NeoVerse Store',
}

export default function VRShowroomPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm text-muted">Spatial inspection</p>
          <h1 className="mt-2 text-4xl font-display font-medium tracking-tight md:text-5xl">Walk around the collection</h1>
          <p className="mt-4 text-base leading-7 text-muted">Move through the showroom to compare objects at a human scale. No headset required.</p>
        </div>

        <Suspense fallback={<div className="h-[600px] rounded-2xl bg-white/5 animate-pulse" />}>
          <VRShowroomWrapper />
        </Suspense>
      </div>
    </div>
  )
}
