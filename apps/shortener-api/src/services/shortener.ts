/**
 * The service for managing everything related to the shortener
 * @module ShortenerService
 */

import ShortenerDb from '@dbs/shortener';
import ShortenerModel from '@models/shortener';
import ENVIRONMENT from '@src/environment';
import {
  type ShortenerType,
  ShortenerServiceType,
} from '@interfaces/shortener';

/**
 * Class for handling anything related to the shortener
 */
class ShortenerService implements ShortenerServiceType {
  #shortenerDb;
  #shortenerModel;
  constructor(shortenerDb, shortenerModel) {
    this.#shortenerDb = shortenerDb;
    this.#shortenerModel = shortenerModel;
  }

  /**
   * Check if the link has expired
   * @param shortener {ShortenerType} The shortener object
   * @returns {boolean} True if the link is expired, or else false
   */
  isExpired(shortener: ShortenerType): boolean {
    const toDay = new Date();
    return (
      toDay.getTime() + ENVIRONMENT.APP.EXPIRATION_IN_MINUTE * 60 * 1000 <
      shortener.createdDate.getTime()
    );
  }

  /**
   * Return the shortener object based on the short url
   * @param shortURL {string} The short url to search
   * @returns {Shortener} The shortener object found
   */
  async getShortenUrl(shortURL: string): Promise<ShortenerType> {
    await this.#shortenerDb.incrementByShortUrl(
      {
        shortURL,
      },
      'countUsage'
    );
    return this.#shortenerDb.getByShortUrl({ shortURL });
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
    const tmpShortened = new this.#shortenerModel({
      longURL,
    });

    // Check if this shortener already exist
    const isExist = await this.#shortenerDb.isExist(tmpShortened);
    // Check if a shortener already exist to optimize the database size
    // If it exist, we use the previous registered shorterned url
    if (isExist.longURL.length === 1) {
      return this.#shortenerDb.getByLongUrl(tmpShortened);
    }

    // Check if a shortener already exist with the same shortURL
    // if it already exist, replace it
    if (isExist.shortURL.length === 1) {
      return this.#shortenerDb.updateByShortUrl(tmpShortened);
    }

    return this.#shortenerDb.save(tmpShortened);
  }
}

const shortenerDb = new ShortenerDb(ShortenerModel);
const shortenerService = new ShortenerService(shortenerDb, ShortenerModel);

export default shortenerService;
