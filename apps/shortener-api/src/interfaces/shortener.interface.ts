import express from 'express';
import { AnyKeys } from 'mongoose';
import { ShortenerType } from '@root/types';
import { ExceptionServiceType } from './error.interface';
import { ExceptionType } from '@root/types';
import ShortenerModel from '@models/shortener.model';
export interface ShortenerDbType {
  save: (tmpShortened: ShortenerType) => Promise<ShortenerType>;
  getByShortUrl: ({ shortURL }: { shortURL: string }) => Promise<ShortenerType>;
  getByLongUrl: ({ longURL }: { longURL: string }) => Promise<ShortenerType>;
  incrementByShortUrl: (
    { shortURL }: { shortURL: string },
    field: AnyKeys<typeof ShortenerModel>
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

export interface ShortenerControllerType {
  saveShortURL: (
    req: express.Request,
    res: express.Response
  ) => Promise<express.Response>;
  redirectToLongURL: (
    req: express.Request,
    res: express.Response
  ) => Promise<void | express.Response>;
}

export interface ShortenerServiceType {
  shortenUrl: (longURL: string) => Promise<ShortenerType>;
  getShortenUrl: (shortURL: string) => Promise<ShortenerType>;
  isExpired: (shortener: ShortenerType) => boolean;
}

export interface ShortenerControllerDependenciesType {
  shortenerService: ShortenerServiceType;
  exceptionService: ExceptionServiceType;
  shortenerDao: ShortenerDaoType;
}

export interface ShortenerDaoType {
  saveShortURLValidator(req: express.Request): Promise<ExceptionType | null>;
  redirectToLongURLValidator(req: express.Request): ExceptionType | null;
}
