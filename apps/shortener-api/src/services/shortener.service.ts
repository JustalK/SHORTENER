/**
 * The service for managing everything related to the shortener
 * @module ShortenerService
 */

import ShortenerRepository from '@repositories/shortener.repository';
import ENVIRONMENT from '@src/environment';
import {
  ShortenerServiceType,
  ShortenerDbType,
} from '@interfaces/shortener.interface';
import { ShortenerType } from '@root/types';
import ShortenerModel from '@models/shortener.model';
import { AnyKeys } from 'mongoose';

/**
 * Class for handling anything related to the shortener
 */
export class ShortenerService implements ShortenerServiceType {
  private static instance: ShortenerService;
  #shortenerRepository: ShortenerDbType;

  private constructor(dependencies: { repository: ShortenerDbType }) {
    this.#shortenerRepository = dependencies.repository;
  }

  public static getInstance(dependencies: { repository: ShortenerDbType }) {
    if (!ShortenerService.instance || ENVIRONMENT.MODE === 'test') {
      ShortenerService.instance = new ShortenerService(dependencies);
    }

    return ShortenerService.instance;
  }

  /**
   * Check if the link has expired
   * @param shortener {ShortenerType} The shortener object
   * @returns {boolean} True if the link is expired, or else false
   */
  isExpired(shortener: ShortenerType): boolean {
    const toDay = new Date();
    return (
      shortener.createdDate.getTime() +
        ENVIRONMENT.APP.EXPIRATION_IN_MINUTE * 60 * 1000 <
      toDay.getTime()
    );
  }

  /**
   * Return the shortener object based on the short url
   * @param shortURL {string} The short url to search
   * @returns {Shortener} The shortener object found
   */
  async getShortenUrl(shortURL: string): Promise<ShortenerType> {
    await this.#shortenerRepository.incrementByShortUrl(
      {
        shortURL,
      },
      'countUsage' as AnyKeys<typeof ShortenerModel>
    );
    return this.#shortenerRepository.getByShortUrl({ shortURL });
  }

  /**
   * Shorten the url and save the longURL and shortURL to the database, return the shortener object
   * Check if the url has already been shorten, in this case, return the previous one
   * Check if the shorten url already exist, in this case, update the previous one
   * @param longURL {string} The url to shorten
   * @returns {Shortener} The shortener object found
   */
  async shortenUrl(longURL: string): Promise<ShortenerType> {
    // Prepare the object for saving
    const tmpShortened = this.#shortenerRepository.getObj({
      longURL,
    });

    // Check if this shortener already exist
    const isExist = await this.#shortenerRepository.isExist(tmpShortened);
    // Check if a shortener already exist to optimize the database size
    // If it exist, we use the previous registered shorterned url
    if (isExist.longURL.length === 1) {
      return this.#shortenerRepository.getByLongUrl(tmpShortened);
    }

    // Check if a shortener already exist with the same shortURL
    // if it already exist, replace it
    if (isExist.shortURL.length === 1) {
      return this.#shortenerRepository.updateByShortUrl(tmpShortened);
    }

    return this.#shortenerRepository.save(tmpShortened);
  }
}

export default ShortenerService.getInstance({
  repository: ShortenerRepository,
});
