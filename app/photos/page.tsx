// app/photos/page.tsx
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

import placeholders from "@/public/placeholders.json";

export default async function Photos() {
  const fetchAlbumsWithCovers = async () => {
    const { data: albumsData, error: albumsError } = await supabase
      .from("albums")
      .select("name, path, year, order");

    if (albumsError) {
      console.error(albumsError);
      return [];
    }

    const sortedAlbums = albumsData?.sort((a, b) => b.order - a.order) || [];

    // For each album, fetch exactly 1 file from the folder so we can display a cover
    const albumsWithCovers = await Promise.all(
      sortedAlbums.map(async (album) => {
        const albumFolder = album.path.split("/")[2]; // e.g. "bogota2023"
        const { data: coverData, error: coverError } = await supabase.storage
          .from("images")
          .list(albumFolder, { limit: 1 });

        if (coverError) {
          console.error(coverError);
        }

        return {
          ...album,
          // If there's at least one file in the folder, use it as "cover"
          cover: coverData?.length ? coverData[0] : null,
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
    <div className="w-full space-y-6 mx-auto py-4">
      <h1 className="text-3xl font-bold">Photos</h1>

      {Object.keys(albumsByYear)
        .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years descending
        .map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-md sm:text-xl font-bold">{year}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {albumsByYear[year].map((album) => {
                const albumFolder = album.path.split("/")[2];

                // If we have at least one "cover" file in that folder
                if (album.cover) {
                  const filePath = `${albumFolder}/${album.cover.name}`;
                  console.log("File path:", filePath);

                  // Check placeholders.json for that filePath
                  const blurDataURL =
                    (
                      placeholders as Record<
                        string,
                        {
                          placeholder: string;
                          width: number;
                          height: number;
                        }
                      >
                    )[filePath] || "";

                  return (
                    <Link
                      key={album.name}
                      href={`/photos/${albumFolder}`}
                      className="border border-black flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="relative w-auto h-44">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${filePath}`}
                          alt={`Cover for ${album.name}`}
                          fill
                          placeholder="blur"
                          blurDataURL={blurDataURL.placeholder}
                          className="rounded-none shadow-xl object-cover"
                          loading="lazy"
                          quality={70}
                        />
                      </div>
                      <p className="p-2 text-sm group-hover:bg-orange-200">
                        {album.name}
                      </p>
                    </Link>
                  );
                } else {
                  // If no cover found
                  return (
                    <Link
                      key={album.name}
                      href={`/photos/${albumFolder}`}
                      className="border border-black flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="relative w-auto h-44 bg-gray-200 flex items-center justify-center">
                        <span>No Cover</span>
                      </div>
                      <p className="p-2 text-sm group-hover:bg-orange-200">
                        {album.name}
                      </p>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
