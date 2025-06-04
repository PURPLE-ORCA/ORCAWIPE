"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, RotateCcw, Moon, Sun, Github, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function OrcaWipeApp() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

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
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: "#2f024f" }}
            >
              O
            </div>
            <span className="text-2xl font-bold">OrcaWipe</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Remove backgrounds instantly.
          </h1>
          <p className="text-xl text-muted-foreground font-medium">No fluff.</p>
        </div>

        {/* Main Content */}
        {!selectedImage && (
          <Card className="p-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <div
              className={`text-center ${
                isDragOver ? "scale-105" : ""
              } transition-transform duration-200`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#2f024f" }}
              >
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Drop your image here
              </h3>
              <p className="text-muted-foreground mb-8">or click to browse</p>
              <Button
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="text-white"
                style={{ backgroundColor: "#2f024f" }}
              >
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-4">
                Supports JPG, PNG, WebP up to 10MB
              </p>
            </div>
          </Card>
        )}

        {selectedImage && !processedImage && (
          <div className="space-y-8">
            <Card className="p-8">
              <div className="text-center">
                <div className="relative w-full max-w-md mx-auto mb-6">
                  <Image
                    src={imagePreview! || "/placeholder.svg"}
                    alt="Selected image"
                    width={400}
                    height={300}
                    className="rounded-lg object-contain w-full h-auto max-h-64"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {selectedImage.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {!isProcessing ? (
                  <div className="flex gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={simulateBackgroundRemoval}
                      className="text-white"
                      style={{ backgroundColor: "#2f024f" }}
                    >
                      Remove Background
                    </Button>
                    <Button variant="outline" onClick={handleTryAnother}>
                      Choose Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className="w-16 h-16 mx-auto border-4 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: "#2f024f",
                        borderTopColor: "transparent",
                      }}
                    ></div>
                    <p className="text-lg font-medium">
                      Removing background...
                    </p>
                    <div className="max-w-xs mx-auto">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {processedImage && (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-center mb-8">
                Background Removed!
              </h3>

              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-4 text-muted-foreground">
                    Before
                  </h4>
                  <div className="relative">
                    <Image
                      src={imagePreview! || "/placeholder.svg"}
                      alt="Original image"
                      width={300}
                      height={200}
                      className="rounded-lg object-contain w-full h-auto max-h-48 border"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-4 text-muted-foreground">
                    After
                  </h4>
                  <div className="relative">
                    <Image
                      src={processedImage || "/placeholder.svg"}
                      alt="Processed image"
                      width={300}
                      height={200}
                      className="rounded-lg object-contain w-full h-auto max-h-48 border"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="text-white"
                  style={{ backgroundColor: "#2f024f" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleTryAnother}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground">Made by Purple Orca</p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/PURPLE-ORCA/ORCAWIPE.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
