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
import { useState } from "react";
import { Button } from "./ui/button";

// Props for the ImageViewer component
interface ImageViewerProps {
  images: { id: string; name: string }[];
  album: string;
}

// ImageViewer component
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative w-auto h-44 cursor-pointer"
          onClick={() => openImage(index)}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${album}/${image.name}`}
            alt="Album thumbnail"
            fill
            sizes="11rem"
            className="rounded-none shadow-xl object-cover"
            loading="lazy"
            quality={70}
          />
        </div>
      ))}

      <Dialog open={currentIndex !== null} onOpenChange={closeImage}>
        <DialogContent className="w-5/6 bg-orange-100 sm:max-w-3xl mx-auto flex flex-col p-2 sm:p-4 [&>button]:hidden mt-0 sm:rounded-none">
          <DialogHeader className="text-white hidden">
            <DialogTitle>Image Viewer</DialogTitle>
            <DialogDescription>
              Click on the image to close the viewer.
            </DialogDescription>
          </DialogHeader>
          {currentIndex !== null && (
            <div className="flex items-center justify-center w-full h-[60vh] relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${album}/${images[currentIndex].name}`}
                alt="Full-size album image"
                fill
                className="object-contain"
                sizes="80vw"
                quality={90}
              />
            </div>
          )}
          <div className="flex w-full justify-between sm:justify-center">
            <Button
              onClick={showPrevImage}
              variant="ghost"
              size="icon"
              className="hover:bg-inherit hover:underline"
            >
              <ArrowLeft size={32} />
            </Button>
            <Button
              onClick={showNextImage}
              variant="ghost"
              size="icon"
              className="hover:bg-inherit hover:underline"
            >
              <ArrowRight size={32} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
