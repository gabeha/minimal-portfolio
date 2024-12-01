import Image from "next/image";
import { getChannelVideos } from "@/lib/youtube";

interface Video {
  id: string | undefined | null;
  title: string | undefined | null;
  description: string | undefined | null;
  thumbnail: string | undefined | null;
}

export default async function Home() {
  const videos = await getChannelVideos();

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl">My Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos?.map((video: Video) => (
          <div
            key={video.id}
            className="bg-white border-black border shadow-md overflow-hidden"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={video.thumbnail!}
                alt={video.title!}
                width={320}
                height={180}
                quality={100}
                className="w-full object-cover"
              />
            </a>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {video.title?.replace("&#39;", "'")}
                </a>
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {video.description?.replace("&#39;", "'")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
