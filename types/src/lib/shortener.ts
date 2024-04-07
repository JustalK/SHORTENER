import { Document } from 'mongoose';

export interface ShortenerType extends Document {
  longURL: string;
  shortURL: string;
  countUsage: number;
  createdDate: Date;
  isArchive?: boolean;
  toDTO: (fields: string[]) => Partial<ShortenerType>;
}
