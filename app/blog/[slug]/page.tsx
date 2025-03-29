// app/blog/[slug]/page.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts } from "@/lib/post-helper";
import { Post } from "@/types/post";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function BlogView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const PostModule = (await import(`@/content/${slug}.mdx`)) as Post;
  const { default: Post, metadata } = PostModule;

  return (
    <div className="mx-auto py-4 w-full">
      <Button
        asChild
        variant="ghost"
        className="hover:bg-inherit hover:underline text-lg p-0"
      >
        <Link href="/blog" className="flex items-center pb-4">
          <ArrowLeft className="w-3 h-3" />
          Back to blog
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
      <p className="text-gray-500 text-base">{metadata.date}</p>
      <p className="text-gray-700 text-lg">{metadata.description}</p>
      <Separator className="my-4" />

      <div className="prose prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white max-w-none ">
        <Post />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
