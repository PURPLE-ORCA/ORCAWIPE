import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ImageProcessingCardProps {
  selectedImage: File | null
  imagePreview: string | null
  isProcessing: boolean
  progress: number
  onRemoveBackground: () => void
  onTryAnother: () => void
}

export function ImageProcessingCard({
  selectedImage,
  imagePreview,
  isProcessing,
  progress,
  onRemoveBackground,
  onTryAnother,
}: ImageProcessingCardProps) {
  if (!selectedImage) return null

  return (
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
                onClick={onRemoveBackground}
                className="text-white"
                style={{ backgroundColor: "#2f024f" }}
              >
                Remove Background
              </Button>
              <Button variant="outline" onClick={onTryAnother}>
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
              <p className="text-lg font-medium">Removing background...</p>
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
  )
}
