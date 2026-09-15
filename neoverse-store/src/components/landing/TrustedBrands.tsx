'use client'

import { Smartphone, Globe, Box, Headphones, Monitor, Cpu, ScanLine, CuboidIcon as Cube } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

const ecosystems = [
  { icon: Smartphone, name: 'Apple Quick Look', desc: 'AR Quick Look on iOS', platform: 'iOS AR' },
  { icon: Globe, name: 'WebXR', desc: 'Browser-based AR/VR', platform: 'Cross-Platform' },
  { icon: Box, name: 'Google ARCore', desc: 'Android AR experiences', platform: 'Android' },
  { icon: Headphones, name: 'Meta Quest Browser', desc: 'VR showroom compatible', platform: 'VR' },
  { icon: Monitor, name: 'Desktop WebGL', desc: '3D preview without headset', platform: 'Desktop' },
  { icon: Cpu, name: 'Android Scene Viewer', desc: 'GLB model viewing', platform: 'Android' },
  { icon: ScanLine, name: 'USDZ / GLB', desc: 'Industry-standard 3D formats', platform: 'Standard' },
  { icon: Cube, name: 'Three.js', desc: 'Web-based 3D rendering', platform: 'Web' },
]

export function TrustedBrands() {
  return (
    <section className="relative border-b border-line py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal>
          <div className="text-center">
            <p className="mb-3 text-sm font-medium text-electric">Built for the way people already browse</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              Open formats. More ways to see.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              NeoVerse AR and 3D experiences are built on open, industry-standard
              formats — no app download required, no proprietary lock-in.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ecosystems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="group rounded-control border border-line bg-panel p-4 text-center transition-[border-color,box-shadow] duration-200 hover:border-electric/40 hover:shadow-soft sm:p-5"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-control border border-line bg-panel-soft transition-colors group-hover:bg-electric/10">
                    <Icon className="h-5 w-5 text-electric" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-paper">{item.name}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                  <span className="mt-2 inline-block text-[10px] font-medium text-electric/80">
                    {item.platform}
                  </span>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted">
              No special hardware required. All AR experiences work through your
              mobile browser. VR Showroom is accessible from any desktop or
              VR-capable browser.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
