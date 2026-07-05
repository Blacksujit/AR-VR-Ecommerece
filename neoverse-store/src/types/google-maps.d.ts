interface Window {
  initNeoVerseMap: () => void
}

declare const google: {
  maps: {
    Map: new (element: HTMLElement, options: Record<string, unknown>) => void
    Marker: new (options: Record<string, unknown>) => {
      setMap(map: unknown): void
      addListener(event: string, handler: () => void): void
    }
    InfoWindow: new (options: Record<string, unknown>) => {
      open(map: unknown, marker: unknown): void
    }
  }
}
