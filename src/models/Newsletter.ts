import { Schema, model } from 'mongoose';

export interface INewsletter {
  email: string;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

export const Newsletter = model<INewsletter>('Newsletter', NewsletterSchema);
