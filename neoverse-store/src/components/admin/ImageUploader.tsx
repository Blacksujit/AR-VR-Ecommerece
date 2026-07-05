'use client'
import { useState, useRef, useCallback, type DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImagePlus, FileImage, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { api, type ApiResponse } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void
  existingImages?: string[]
  maxFiles?: number
  maxSizeMB?: number
}

export default function ImageUploader({
  onImagesUploaded,
  existingImages = [],
  maxFiles = 10,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  function emitChange(urls: string[]) {
    onImagesUploaded(urls)
  }

  function addImages(urls: string[]) {
    const updated = [...images, ...urls].slice(0, maxFiles)
    setImages(updated)
    emitChange(updated)
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    emitChange(updated)
  }

  async function handleFiles(files: FileList) {
    setError(null)

    const validFiles: File[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not a valid image file`)
        continue
      }
      if (file.size > maxSizeBytes) {
        setError(`"${file.name}" exceeds ${maxSizeMB}MB limit`)
        continue
      }
      if (images.length + validFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`)
        break
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      validFiles.forEach(file => formData.append('images', file))

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 20, 90))
      }, 300)

      const res = await api.post<ApiResponse<string[]>>('/upload/upload-multiple', formData as unknown as Record<string, unknown>)

      clearInterval(progressInterval)
      setUploadProgress(100)

      const uploadedUrls = res.data ?? res
      const urls = Array.isArray(uploadedUrls) ? uploadedUrls : []
      addImages(urls)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [images.length])

  function handlePickerClick() {
    inputRef.current?.click()
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const remaining = maxFiles - images.length

  return (
    <div className="space-y-4" role="region" aria-label="Image uploader">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto hover:text-error/80"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handlePickerClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handlePickerClick() }}
        aria-label="Upload images - drag and drop or click to select"
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {isUploading ? (
          <div className="text-center w-full max-w-xs">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-white/70 font-medium mb-2">Uploading images...</p>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1">{Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              {isDragging ? (
                <FileImage className="w-7 h-7 text-primary" />
              ) : (
                <Upload className="w-7 h-7 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                {isDragging ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-white/40 mt-1">
                or click to browse ({remaining}/{maxFiles} slots remaining)
              </p>
            </div>
            <p className="text-xs text-white/30">
              PNG, JPG, WebP up to {maxSizeMB}MB each
            </p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((url, i) => (
              <motion.div
                key={`${url}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10"
              >
                <img
                  src={url}
                  alt={`Uploaded image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={e => { e.stopPropagation(); removeImage(i) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/90 text-white text-xs font-medium hover:bg-error transition-colors"
                    aria-label={`Delete image ${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); removeImage(i) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {remaining > 0 && !isUploading && (
            <button
              onClick={handlePickerClick}
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1.5 text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
              aria-label="Add more images"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs">Add more</span>
            </button>
          )}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-white/30 text-center">
          {images.length} / {maxFiles} images uploaded
        </p>
      )}
    </div>
  )
}
