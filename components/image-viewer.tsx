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
import { KeyboardEvent, useState, useRef, useEffect, useCallback } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get image info from placeholders - wrapped in useCallback
  const getImageInfo = useCallback(
    (imageName: string) => {
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
    },
    [album]
  );

  // Recalculate container size when window resizes
  useEffect(() => {
    if (currentIndex === null) return;

    const handleResize = () => {
      if (containerRef.current) {
        const viewportWidth = Math.min(window.innerWidth * 0.9, 1200); // 90% of viewport width or max 1200px
        const viewportHeight = window.innerHeight * 0.8; // 80% of viewport height

        const imageInfo = getImageInfo(images[currentIndex].name);
        const imgAspect = imageInfo.width / imageInfo.height;

        let newWidth, newHeight;

        // If image is wider than it is tall
        if (imgAspect > 1) {
          newWidth = Math.min(viewportWidth, imageInfo.width);
          newHeight = newWidth / imgAspect;

          // Check if height exceeds viewport height
          if (newHeight > viewportHeight) {
            newHeight = viewportHeight;
            newWidth = newHeight * imgAspect;
          }
        }
        // If image is taller than it is wide
        else {
          newHeight = Math.min(viewportHeight, imageInfo.height);
          newWidth = newHeight * imgAspect;

          // Check if width exceeds viewport width
          if (newWidth > viewportWidth) {
            newWidth = viewportWidth;
            newHeight = newWidth / imgAspect;
          }
        }

        setContainerSize({
          width: Math.floor(newWidth),
          height: Math.floor(newHeight),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentIndex, images, getImageInfo]);

  const openImage = (index: number) => {
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setCurrentIndex(null);
  };

  const showPrevImage = () => {
    if (currentIndex !== null && !isTransitioning) {
      setIsTransitioning(true);
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      setCurrentIndex(newIndex);

      // Reset transitioning state after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const showNextImage = () => {
    if (currentIndex !== null && !isTransitioning) {
      setIsTransitioning(true);
      const newIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);

      // Reset transitioning state after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Handle arrow-key navigation
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
        <DialogContent className="p-0 [&>button]:hidden rounded-none border-none md:max-w-[90vw] max-h-[80vh] mx-auto flex items-center justify-center overflow-hidden bg-transparent shadow-none border-0">
          <div className="relative" ref={containerRef}>
            {currentIndex !== null && (
              <div
                className="relative overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  width:
                    containerSize.width > 0
                      ? `${containerSize.width}px`
                      : "auto",
                  height:
                    containerSize.height > 0
                      ? `${containerSize.height}px`
                      : "auto",
                  opacity: isTransitioning ? 0.7 : 1,
                }}
              >
                {(() => {
                  const image = images[currentIndex];
                  const { blurDataURL, width, height } = getImageInfo(
                    image.name
                  );

                  return (
                    <Image
                      key={`full-size-${image.id}`}
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${album}/${image.name}`}
                      alt={`Full-size album image: ${image.name}`}
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      width={width}
                      height={height}
                      className="object-cover w-full h-full"
                      quality={90}
                      priority={true}
                      onLoad={() => setIsTransitioning(false)}
                    />
                  );
                })()}

                {/* Navigation buttons - positioned on top of the image container */}
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={showPrevImage}
                    className="p-2 mx-2 bg-black bg-opacity-20 rounded-full text-white pointer-events-auto hover:bg-opacity-40 transition-all"
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button
                    onClick={showNextImage}
                    className="p-2 mx-2 bg-black bg-opacity-20 rounded-full text-white pointer-events-auto hover:bg-opacity-40 transition-all"
                    aria-label="Next image"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
