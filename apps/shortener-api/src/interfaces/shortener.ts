export interface ShortenerType {
  longURL: string;
  shortURL: string;
  countUsage: number;
  createdDate: Date;
  toDTO: (fields: string[]) => Partial<ShortenerType>;
}

export interface ShortenerServiceType {
  shortenUrl: (longURL: string) => Promise<ShortenerType>;
  getShortenUrl: (shortURL: string) => Promise<ShortenerType>;
  isExpired: (shortener: ShortenerType) => boolean;
}
