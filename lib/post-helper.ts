// lib/post-helper.ts

import { Post } from "@/types/post";
import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content");

export async function getAllPosts() {
  const files = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const PostModule = (await import(`@/content/${slug}.mdx`)) as Post;
      const metadata = PostModule.metadata;

      return {
        slug,
        title: metadata.title,
        date: metadata.date,
        description: metadata.description,
      };
    })
  );

  return posts.sort((a, b) =>
    a.date && b.date ? b.date.localeCompare(a.date) : 0
  );
}
