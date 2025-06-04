import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ImageProcessingCardProps {
  imagePreview: string | null;
  isProcessing: boolean;
  onTryAnother: () => void;
}

export function ImageProcessingCard({
  imagePreview,
  isProcessing,
  onTryAnother,
}: ImageProcessingCardProps) {
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
          {isProcessing ? (
            <div className="space-y-4">
              <div
                className="w-16 h-16 mx-auto border-4 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "#2f024f",
                  borderTopColor: "transparent",
                }}
              ></div>
              <p className="text-lg font-medium">Removing background...</p>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onTryAnother}>
                Choose Different Image
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
