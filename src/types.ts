export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  problem: string;
  solution: string;
  image: string;
}

export type View = 'home' | 'post' | 'draft';
