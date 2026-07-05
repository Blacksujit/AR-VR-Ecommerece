'use client'
import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react'

interface StoreMapProps {
  latitude?: number
  longitude?: number
  storeName?: string
  storeAddress?: string
}

type MapLoadState = 'loading' | 'ready' | 'error'

export default function StoreMap({
  latitude = 40.7128,
  longitude = -74.0060,
  storeName = 'NeoVerse Store',
  storeAddress = '123 NeoVerse Street, New York, NY 10001',
}: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loadState, setLoadState] = useState<MapLoadState>('loading')
  const [apiKey, setApiKey] = useState<string | null>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null
    setApiKey(key)
    if (!key) {
      setLoadState('error')
      return
    }
    if (typeof window === 'undefined' || scriptLoadedRef.current) return

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    )
    if (existingScript) {
      checkMapReady()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initNeoVerseMap`
    script.async = true
    script.defer = true
    script.onerror = () => setLoadState('error')
    window.initNeoVerseMap = () => {
      scriptLoadedRef.current = true
      checkMapReady()
    }
    document.head.appendChild(script)
  }, [])

  function checkMapReady() {
    const g = (window as any).google
    if (!mapRef.current || !g) {
      setLoadState('error')
      return
    }
    try {
      const gm = g.maps
      const position = { lat: latitude, lng: longitude }
      const map = new gm.Map(mapRef.current, {
        center: position,
        zoom: 15,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a1a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e1e3a' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a1a35' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a35' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: gm.ControlPosition.RIGHT_CENTER,
        },
      })

      new gm.Marker({
        position,
        map,
        title: storeName,
        animation: gm.Animation.DROP,
        icon: {
          path: gm.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#5B7FFF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })

      const infoWindow = new gm.InfoWindow({
        content: `
          <div style="background:#0a0a1a;color:white;padding:12px 16px;border-radius:12px;font-family:sans-serif;min-width:200px;">
            <strong style="color:#5B7FFF;font-size:14px;">${storeName}</strong>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">${storeAddress}</p>
          </div>
        `,
      })

      gm.event.addListenerOnce(map, 'tilesloaded', () => {
        setLoadState('ready')
      })

      mapRef.current.addEventListener('click', () => infoWindow.open(map))
    } catch {
      setLoadState('error')
    }
  }

  function handleGetDirections() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(storeName)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full" aria-label={`Map showing ${storeName} location`}>
      <div
        className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a1a]"
        role="region"
        aria-label={`Map of ${storeName}`}
      >
        {loadState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a1a] z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-white/40">Loading map...</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {loadState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a1a] z-10">
            {apiKey ? (
              <>
                <AlertTriangle className="w-8 h-8 text-warning" />
                <p className="text-sm text-white/60">Failed to load map</p>
                <p className="text-xs text-white/30">Please try refreshing the page</p>
              </>
            ) : (
              <>
                <MapPin className="w-8 h-8 text-white/30" />
                <p className="text-sm text-white/60">Map unavailable</p>
                <p className="text-xs text-white/30 text-center max-w-xs">
                  Google Maps API key not configured. Set{' '}
                  <code className="text-primary text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> in your environment.
                </p>
              </>
            )}
          </div>
        )}

        {loadState === 'ready' && (
          <button
            onClick={handleGetDirections}
            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-glow"
            aria-label="Get directions to store"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </button>
        )}
      </div>

      {loadState === 'ready' && (
        <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{storeAddress}</span>
        </div>
      )}
    </div>
  )
}


