// types/mdx-post.ts
export interface Post {
  default: React.ComponentType;
  metadata: {
    title: string;
    date: string;
    description: string;
  };
}
