"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, KeyboardEvent } from "react";
import { Button } from "./ui/button";

// Import placeholders JSON (with { placeholder, width, height } for each image)
import placeholders from "@/public/placeholders.json";

/**
 * Each `images` item has: { id: string; name: string }
 * The `album` is the folder name (e.g. "bogota2023").
 */
interface ImageViewerProps {
  images: { id: string; name: string }[];
  album: string;
}

export function ImageViewer({ images, album }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setCurrentIndex(null);
  };

  const showPrevImage = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    }
  };

  const showNextImage = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % images.length);
    }
  };

  // Optional: handle arrow-key navigation in the overall container
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") showPrevImage();
    else if (e.key === "ArrowRight") showNextImage();
    else if (e.key === "Escape") closeImage();
  };

  return (
    // Use CSS columns for a basic masonry layout
    <div
      className="columns-2 md:columns-3 gap-4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Image viewer. Use left/right arrows to navigate. Press Escape to close."
    >
      {images.map((image, index) => {
        // Build the key to look up in placeholders.json
        const filePath = `${album}/${image.name}`;

        // The JSON entry has: { placeholder, width, height }
        const info = (
          placeholders as Record<
            string,
            { placeholder: string; width: number; height: number }
          >
        )[filePath];

        const blurDataURL = info?.placeholder || "";
        const originalWidth = info?.width || 600; // fallback
        const originalHeight = info?.height || 400; // fallback

        return (
          <div
            key={image.id}
            className="mb-4 break-inside-avoid cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => openImage(index)}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${filePath}`}
              alt={`Thumbnail for ${image.name}`}
              width={originalWidth}
              height={originalHeight}
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="w-full h-auto object-cover"
              loading="lazy"
              quality={60}
            />
          </div>
        );
      })}

      {/* Dialog for the large image */}
      <Dialog open={currentIndex !== null} onOpenChange={closeImage}>
        <DialogHeader className="text-white hidden">
          <DialogTitle>Image Viewer</DialogTitle>
          <DialogDescription>
            Click on the image to close the viewer.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="p-0 [&>button]:hidden rounded-none border-none">
          <div className="relative w-full h-auto">
            {currentIndex !== null ? (
              (() => {
                const filePath = `${album}/${images[currentIndex].name}`;
                const info = (
                  placeholders as Record<
                    string,
                    { placeholder: string; width: number; height: number }
                  >
                )[filePath];

                const blurDataURL = info?.placeholder || "";
                const originalWidth = info?.width || 800;
                const originalHeight = info?.height || 600;

                return (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${filePath}`}
                    alt={`Full-size album image: ${images[currentIndex].name}`}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    width={originalWidth}
                    height={originalHeight}
                    className="object-cover w-full h-auto"
                    quality={90}
                  />
                );
              })()
            ) : (
              <p>No images here.</p>
            )}

            <Button
              onClick={showPrevImage}
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 
                           bg-white/70 hover:bg-white text-black 
                           focus:outline-none focus:ring-2 focus:ring-orange-200 
                           transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft size={32} />
            </Button>
            <Button
              onClick={showNextImage}
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 
                           bg-white/70 hover:bg-white text-black
                           focus:outline-none focus:ring-2 focus:ring-orange-200 
                           transition-colors"
              aria-label="Next image"
            >
              <ArrowRight size={32} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
