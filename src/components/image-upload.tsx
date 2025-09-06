'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageUpload(data.imageUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao enviar imagem')
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={triggerFileInput}
        disabled={isUploading}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="Enviar imagem"
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        ) : (
          <span className="text-lg">📷</span>
        )}
      </button>
      
      {error && (
        <div className="absolute bottom-full left-0 mb-2 bg-red-100 border border-red-200 rounded-lg px-2 py-1 text-xs text-red-600 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  )
}