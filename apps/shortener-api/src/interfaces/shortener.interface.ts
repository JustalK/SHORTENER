import { ShortenerType } from '@root/types';
export interface ShortenerDbType {
  save: (tmpShortened: ShortenerType) => Promise<ShortenerType>;
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
