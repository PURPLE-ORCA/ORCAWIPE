"use client"

import React, { useState, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/HeroSection"
import { ImageUploadCard } from "@/components/ImageUploadCard"
import { ImageProcessingCard } from "@/components/ImageProcessingCard"
import { ProcessedImageCard } from "@/components/ProcessedImageCard"
import { Footer } from "@/components/footer"

export default function OrcaWipeApp() {
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(null);
  const [processedImageBase64, setProcessedImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProcessedImageBase64(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setOriginalImageBase64(base64); // Show original image immediately

      try {
        // Call your API route
        const apiResponse = await fetch('/api/remove-background', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }), // Send { "image": "..." }
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.error || `API request failed with status ${apiResponse.status}`);
        }

        const { cleanedImageBase64 } = await apiResponse.json();
        setProcessedImageBase64(cleanedImageBase64);

      } catch (err: any) {
        console.error("Error processing image:", err);
        setError(err.message || "Failed to process image. Please try again.");
        setProcessedImageBase64(null); // Clear any previous processed image on error
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file.");
      setError("Failed to read the selected file.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file); // 'file' is the File object from the input
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleImageUpload(files[0]);
      }
    },
    [handleImageUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleImageUpload(files[0]);
      }
    },
    [handleImageUpload],
  );

  const handleTryAnother = useCallback(() => {
    setOriginalImageBase64(null);
    setProcessedImageBase64(null);
    setError(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (processedImageBase64) {
      const link = document.createElement("a");
      link.href = processedImageBase64;
      link.download = "background-removed.png";
      link.click();
    }
  }, [processedImageBase64]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <HeroSection />
        {!originalImageBase64 && (
          <ImageUploadCard
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileInputChange={handleFileInputChange}
            fileInputRef={fileInputRef}
            isDragOver={isDragOver}
          />
        )}

        {originalImageBase64 && !processedImageBase64 && (
          <ImageProcessingCard
            imagePreview={originalImageBase64}
            isProcessing={isLoading}
            onTryAnother={handleTryAnother}
          />
        )}

        {processedImageBase64 && (
          <ProcessedImageCard
            imagePreview={originalImageBase64}
            processedImage={processedImageBase64}
            onDownload={handleDownload}
            onTryAnother={handleTryAnother}
          />
        )}

        {isLoading && (
          <div className="text-center text-lg mt-8">Processing image...</div>
        )}

        {error && (
          <div className="text-center text-red-500 mt-8">{error}</div>
        )}
      </main>
      <Footer />
    </div>
  )
}
