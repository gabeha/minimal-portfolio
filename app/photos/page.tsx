import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default async function Photos() {
  const fetchAlbumsWithCovers = async () => {
    const { data: albumsData, error: albumsError } = await supabase
      .from("albums")
      .select("name, path, thumbnail, emoji, year, order");

    if (albumsError) {
      console.error(albumsError);
      return [];
    }

    const sortedAlbums = albumsData?.sort((a, b) => b.order - a.order) || [];

    const albumsWithCovers = await Promise.all(
      sortedAlbums.map(async (album) => {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("images")
          .list(album.path.split("/")[2], { limit: 1 });

        if (coverError) {
          console.error(coverError);
        }

        return {
          ...album,
          cover: coverData ? coverData[0] : null,
        };
      })
    );

    return albumsWithCovers;
  };

  const albums = await fetchAlbumsWithCovers();

  // Group albums by year
  const albumsByYear = albums.reduce((acc, album) => {
    acc[album.year] = acc[album.year] ? [...acc[album.year], album] : [album];
    return acc;
  }, {} as Record<string, typeof albums>);

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl">Albums</h1>
      {Object.keys(albumsByYear)
        .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
        .map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-md sm:text-xl font-bold">{year}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {albumsByYear[year].map((album) => (
                <Link
                  key={album.name}
                  href={`/photos/${album.path.split("/")[2]}`}
                >
                  <div
                    key={album.name}
                    className="border border-black flex flex-col group"
                  >
                    {album.cover ? (
                      <div className="relative w-auto h-44">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${
                            album.path.split("/")[2]
                          }/${album.cover.name}`}
                          alt={`Cover for ${album.name}`}
                          fill
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAHTAjsDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAECBAMG/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APnwG2RUUAABUUAAFAAVFAABQBQAFAAAAAAAQAAQAURUARUAABEVEBFQBFQVAARFQBFQBFRBAFEAEQABFQAAQRUVAAAAQAAAB1gKoACgAKgCgAoigKgCgAKiigACoAoAACAAAioAAKgACKgAIgIqAIqAIAqAgCKgCKgCAggAiAKIAAgCAACKigAIACAAAAOsBVAAFQBQAURQFQBQAURRQAFEUAAABBRFAEAABQEAABAAEVEBAAQAQEFEVAEVAQBBAQBFQQBFAEAAEAAQBQAEAAABAAHWIKqiKAAAqKAAKoACooAAKIoAAKIqAAAAAAKAgAACAACIAIACAIqCiKgCACAiAioAioAgCCAoIqAAAIAgAAAqCKgAAAAOsBVAAFQBQAURQFQBQAURQAEFAAABRAFEBQAAABAAAAQEBAAQAQAVAQBFQBAQEAEBAAQQBAAAEBQAEAAQAQAUAAAAdQCqKgCiKAqAKIoCoqAqAKACiKAACiAqiAKIAogAAACIKgAIACKgCAKIACACAiAioAgAIAIAIIACAAAoIAgAAAAAIAAAA6QGlFQBRFQFQBQAURQUQBVQFURQAAUQBRAFAABEFQAAAEAAQFEABAAQAEBBAQAEAQAEABAEEAAQAAABBFEFFEAUQBRARRAHSqCqogCgAogCqgKoigogCgAoigAAoggogCiAKIAqAACCqgAIACAAgICAAggAIAgAIACAAgCCAAIAqAAAAAIAAAAAAAA6RBoUQFURQUQBQAURQFQQVUAUQBQAUQBRAVRAFEAAABAAEBUBAQAEABBAAQBFQBAAQQAEABBAAAQQVAAAUAAAAUQBRARRAHQA0qiAKIIKqAKIoKIAqoAoiiqIAoigAAogCoCAAACAqAAIAAgAIACAAgAgAggKggAgAIIAgICAKIAAgKAAAAACiAKIAogDoEGhRFAVAFEUFEBVVAFEUFEAUBBRAFEUAAAAAEBRAAABAAQAEABAAQQFQQBAAQRBUEBUQAEBFQAAQFEAURQAAAEFEAUQBRAHQINiiAKIoqiAKqAKIqCiAKqAKIoCoCqIAogCiAKIAAgKIIAICoICoIACCAgAggKggCCAqCACAKggiiAKIAogCiKAACiAqiAKAAAg9hFaBUAUQBVZUFEAVUAVUAUQFaEEFEAURQAABAFEAUQABAVAAQAEEBUEAEAEEBUEEEEBUEBUBUBAFQAAAUQBQAFQRVEAUAAAAAHsIKKIAoigogCqgiqIoKIAqoAogCgAogCiAqiAKgACAioAAgAIACACCIKiACCKKiAggACCoAAAAAAAAAAAAoigACgACoIKIA9RAVRAFVAFEUFEAaEAVWVBRBBVQFUQBRFAAABAUQBUAAQAEABAAQAQQRUQAQRQAVBAEAAAAAAAAAAAAAAAAURQABQAAAGxBFUAFEAVUEFVlQUQFaEAVWVBRAFVlUFEAUQBRAAAAQABAVBAVBAARQQAEEVABUEAQAAAAAAAAAAAAAAAAAAABRFAAFAAaEEVRAFAQUQBVQFVWVBRFQUQBVQBRAFEAUQBRAFEAAQFEAEABAUEEAAVEAEEVFQAAAAAAAAAAAAAAAAAAAAAAAAVAFEAVUEaUQBQAURQFQRVABRFAVBBQAFQBRAFEAUQBUAAEABAAFBABAFBAEARUABAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAFAAAEVRFAVAFVBFUAFEAUBAVAFEAUQBRAFQAARQBAVAAQFBFQQAVBAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAUAAAAARVAAVFAAQUAUVAFAAAQAAAAARQAAQAEVFAEEABAEVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFEAUAAAUAAVFQABVAAVFQAAAUAAAABFQAABFQABRAAQAABUEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRAFAFAAUBAVFAABQAAAFAAABAAAARUARUFEVBABQBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAABQAFAAFAAAABQAAAEVAAAEVAEUBEUFQABAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRRBQEUAAAFRRAAFAAVFAAAVFAAAAQAFEAARQEAFQAEABBUAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUBoAAABBQAAAUAABBQQAAUAAAAAAABFQAAVBUBBUUQVAAEURQEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUBpAABQAAAVFEAAFAAAQVAFAAAAAAAAAFQABFQBFARFBUAFAAEUQQBAAAAAAAAAAAAAAAAAAAAAAAAAAAABQVtEUAAEAFAAEFRQABAFAAAAAAAAAAAAARQEABABUAFQVFABFAAEUQQBAAAAAAAAAAAAAAAAAAAAAAAAAABoBtAAAFAAEAAUAABEUAAAAAAAQAAAFAAAFEAARUFEVAEVBQBFAAAEEFQABAAAAAAAAAAAAAAAAAAAAAAAABoBtAABUUQAAABQAFRRAAAAAAQAAAAAAAFAAEVAEVBRFARFQUAFAEABARUAAQAAAAAAAAAAAAAAAAAAAAAAAAaAbQAEFAAAAAFAEFAAAAAAAQAAAAAAAFAAEABAFAARAFABQBAAQEAABAAAAAAAAAAAAAAAAAAAAAAAAB//Z"
                          sizes="11rem"
                          className="rounded-none shadow-xl object-cover"
                          loading="lazy"
                          quality={70}
                        />
                      </div>
                    ) : (
                      <div className="relative w-auto h-44 bg-gray-200 flex items-center justify-center">
                        <span>No Cover</span>
                      </div>
                    )}
                    <p className="p-2 text-sm group-hover:bg-orange-200">
                      {album.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
