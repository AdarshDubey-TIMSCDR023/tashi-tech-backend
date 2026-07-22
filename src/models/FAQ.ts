import { Schema, model } from 'mongoose';

export interface IFAQ {
  question: string;
  answer: string;
  category: string;
  order: number;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export const FAQ = model<IFAQ>('FAQ', FAQSchema);
