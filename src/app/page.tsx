"use client"

import React, { useState, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/HeroSection"
import { ImageUploadCard } from "@/components/ImageUploadCard"
import { ImageProcessingCard } from "@/components/ImageProcessingCard"
import { ProcessedImageCard } from "@/components/ProcessedImageCard"
import { Footer } from "@/components/footer"

export default function OrcaWipeApp() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setProcessedImage(null)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const simulateBackgroundRemoval = useCallback(async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // For demo purposes, we'll use the same image as "processed"
    // In a real app, this would be the result from your AI API
    setProcessedImage(imagePreview)
    setIsProcessing(false)
    setProgress(100)
  }, [imagePreview])

  const handleTryAnother = useCallback(() => {
    setSelectedImage(null)
    setImagePreview(null)
    setProcessedImage(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (processedImage) {
      const link = document.createElement("a")
      link.href = processedImage
      link.download = "background-removed.png"
      link.click()
    }
  }, [processedImage])

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <HeroSection />
        {!selectedImage && (
          <ImageUploadCard
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileInputChange={handleFileInputChange}
            fileInputRef={fileInputRef}
            isDragOver={isDragOver}
          />
        )}

        {selectedImage && !processedImage && (
          <ImageProcessingCard
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            isProcessing={isProcessing}
            progress={progress}
            onRemoveBackground={simulateBackgroundRemoval}
            onTryAnother={handleTryAnother}
          />
        )}

        {processedImage && (
          <ProcessedImageCard
            imagePreview={imagePreview}
            processedImage={processedImage}
            onDownload={handleDownload}
            onTryAnother={handleTryAnother}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
