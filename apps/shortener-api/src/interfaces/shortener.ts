import { Document } from 'mongoose';

export interface ShortenerType extends Document {
  longURL: string;
  shortURL: string;
  countUsage: number;
  createdDate: Date;
  isArchive?: boolean;
  toDTO: (fields: string[]) => Partial<ShortenerType>;
}

export interface ShortenerDbType {
  save: (tmpShortened: Document) => Promise<ShortenerType>;
  getByShortUrl: ({ shortURL }: { shortURL: string }) => Promise<ShortenerType>;
  getByLongUrl: ({ longURL }: { longURL: string }) => Promise<ShortenerType>;
  incrementByShortUrl: (
    { shortURL }: { shortURL: string },
    field: string
  ) => Promise<ShortenerType>;
  updateByShortUrl: ({
    shortURL,
    longURL,
  }: {
    shortURL: string;
    longURL: string;
  }) => Promise<ShortenerType>;
  isExist: ({
    longURL,
    shortURL,
  }: {
    longURL: string;
    shortURL: string;
  }) => Promise<{
    longURL: ShortenerType[];
    shortURL: ShortenerType[];
  }>;
  getObj: ({ longURL }: { longURL: string }) => ShortenerType;
}

export interface ShortenerServiceType {
  shortenUrl: (longURL: string) => Promise<ShortenerType>;
  getShortenUrl: (shortURL: string) => Promise<ShortenerType>;
  isExpired: (shortener: ShortenerType) => boolean;
}
