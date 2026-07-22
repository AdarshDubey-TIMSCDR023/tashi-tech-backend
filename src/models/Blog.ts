import { Schema, model } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Blog = model<IBlog>('Blog', BlogSchema);
