import React from "react"
import Image from "next/image"
import { Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ProcessedImageCardProps {
  imagePreview: string | null
  processedImage: string | null
  onDownload: () => void
  onTryAnother: () => void
}

export function ProcessedImageCard({
  imagePreview,
  processedImage,
  onDownload,
  onTryAnother,
}: ProcessedImageCardProps) {
  if (!processedImage) return null

  return (
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
            onClick={onDownload}
            className="text-white"
            style={{ backgroundColor: "#2f024f" }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={onTryAnother}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another
          </Button>
        </div>
      </Card>
    </div>
  )
}
