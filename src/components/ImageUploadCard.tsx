import React from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploadCardProps {
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isDragOver: boolean
}

export function ImageUploadCard({
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInputChange,
  fileInputRef,
  isDragOver,
}: ImageUploadCardProps) {
  return (
    <Card className="p-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
      <div
        className={`text-center ${
          isDragOver ? "scale-105" : ""
        } transition-transform duration-200`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#2f024f" }}
        >
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Drop your image here</h3>
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
          onChange={onFileInputChange}
          className="hidden"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Supports JPG, PNG, WebP up to 10MB
        </p>
      </div>
    </Card>
  )
}
