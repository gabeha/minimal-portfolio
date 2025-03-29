// app/blog/page.tsx
import { getAllPosts } from "@/lib/post-helper";
import Link from "next/link";

export default async function Blog() {
  const posts = await getAllPosts();
  return (
    <div className="w-full space-y-6 mx-auto py-4">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <div className="hover:underline text-xl font-medium">
                {post.title}
              </div>
              <p className="text-base text-gray-500">{post.description}</p>
              <p className="text-sm text-gray-400">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
