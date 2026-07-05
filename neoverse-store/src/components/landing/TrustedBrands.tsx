'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'

const brandsRow1 = [
  'TechCorp',
  'FutureLabs',
  'NovaTech',
  'Quantum',
  'ApexDigital',
  'CyberCore',
  'NexGen',
  'OrbitAI',
]

const brandsRow2 = [
  'PulseWave',
  'StarGate',
  'FusionX',
  'Vortex',
  'EonSys',
  'Helios',
  'Zenith',
  'Aether',
]

export function TrustedBrands() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              Trusted by <span className="gradient-text">Industry Leaders</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Partnering with the world&apos;s most innovative technology companies
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="space-y-8">
        <div className="relative flex overflow-hidden group">
          <div className="flex gap-16 animate-scroll shrink-0">
            {brandsRow1.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center min-w-[140px] h-16"
              >
                <span className="text-lg font-display font-bold text-white/20 select-none tracking-wider uppercase">
                  {brand}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-16 animate-scroll shrink-0">
            {brandsRow1.map((brand) => (
              <div
                key={`dup-${brand}`}
                className="flex items-center justify-center min-w-[140px] h-16"
              >
                <span className="text-lg font-display font-bold text-white/20 select-none tracking-wider uppercase">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="flex gap-16 animate-scroll shrink-0" style={{ animationDirection: 'reverse' }}>
            {brandsRow2.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center min-w-[140px] h-16"
              >
                <span className="text-lg font-display font-bold text-white/20 select-none tracking-wider uppercase">
                  {brand}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-16 animate-scroll shrink-0" style={{ animationDirection: 'reverse' }}>
            {brandsRow2.map((brand) => (
              <div
                key={`dup-${brand}`}
                className="flex items-center justify-center min-w-[140px] h-16"
              >
                <span className="text-lg font-display font-bold text-white/20 select-none tracking-wider uppercase">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
