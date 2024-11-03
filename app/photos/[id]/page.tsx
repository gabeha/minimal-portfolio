import { Button } from "@/components/ui/button";
import { formatTitle } from "@/lib/utils";
import { supabase } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageViewer } from "@/components/image-viewer";

interface AlbumViewProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumView({ params }: AlbumViewProps) {
  const { id: album } = await params;

  const fetchPhotos = async () => {
    const { data, error } = await supabase.storage.from("images").list(album);

    if (error) {
      console.error(error);
      return [];
    }
    return data;
  };

  const imageUrls = await fetchPhotos();

  return (
    <div className="w-full">
      <Button
        asChild
        variant="ghost"
        className="hover:bg-inherit hover:underline text-lg p-0"
      >
        <Link href="/photos" className="flex items-center pb-4">
          <ArrowLeft className="w-3 h-3" />
          Back to albums
        </Link>
      </Button>
      <div className="w-full mx-auto text-center space-y-4">
        <h1 className="text-2xl">{formatTitle(album)}</h1>
        {imageUrls.length > 0 ? (
          <ImageViewer images={imageUrls} album={album} />
        ) : (
          <p>This album does not exist.</p>
        )}
      </div>
    </div>
  );
}
