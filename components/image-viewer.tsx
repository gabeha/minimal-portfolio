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
import { KeyboardEvent, useState } from "react";

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

  // Helper function to get image info from placeholders
  const getImageInfo = (imageName: string) => {
    const filePath = `${album}/${imageName}`;
    const info = (
      placeholders as Record<
        string,
        { placeholder: string; width: number; height: number }
      >
    )[filePath];

    return {
      blurDataURL: info?.placeholder || "",
      width: info?.width || 800,
      height: info?.height || 600,
    };
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
        const { blurDataURL, width, height } = getImageInfo(image.name);

        return (
          <div
            key={image.id}
            className="mb-4 break-inside-avoid cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => openImage(index)}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${album}/${image.name}`}
              alt={`Thumbnail for ${image.name}`}
              width={width}
              height={height}
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
            {currentIndex !== null && (
              <>
                {/* Current image */}
                {(() => {
                  const image = images[currentIndex];
                  const { blurDataURL, width, height } = getImageInfo(
                    image.name
                  );

                  return (
                    <Image
                      key={`fullsize-${image.id}`}
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${album}/${image.name}`}
                      alt={`Full-size album image: ${image.name}`}
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      width={width}
                      height={height}
                      className="object-cover w-full h-auto"
                      quality={90}
                      priority={true}
                    />
                  );
                })()}

                {/* Navigation buttons */}
                <button
                  onClick={showPrevImage}
                  className="absolute bottom-0 left-2 -translate-y-1/2 text-white"
                  aria-label="Previous image"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute bottom-0 right-2 -translate-y-1/2 text-white"
                  aria-label="Next image"
                >
                  <ArrowRight size={24} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
