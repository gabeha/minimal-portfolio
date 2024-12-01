import { google } from "googleapis";
import { youtube_v3 } from "googleapis/build/src/apis/youtube";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getChannelVideos() {
  try {
    const response = await youtube.search.list({
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      part: ["snippet"],
      order: "date",
      maxResults: 50,
    });

    const data = response?.data?.items?.filter(
      (item) => item?.id?.kind === "youtube#video"
    );

    return (
      data?.map((item: youtube_v3.Schema$SearchResult | undefined) => ({
        id: item?.id?.videoId,
        title: item?.snippet?.title,
        description: item?.snippet?.description,
        thumbnail: item?.snippet?.thumbnails?.medium?.url,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}
