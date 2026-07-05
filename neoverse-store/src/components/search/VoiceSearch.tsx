'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceSearchProps {
  onResult: (transcript: string) => void
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionConstructor) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.results[event.results.length - 1]
      const text = current[0].transcript
      setTranscript(text)

      if (current.isFinal) {
        onResult(text)
        setIsListening(false)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      setTranscript('')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [onResult])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript('')
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
      }
    }
  }, [isListening])

  if (!supported) return null

  return (
    <button
      onClick={toggleListening}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 animate-pulse'
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Search with voice'}
      title={isListening ? 'Listening...' : 'Voice search'}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[10px] text-white">
            {transcript || 'Listening...'}
          </span>
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  )
}
