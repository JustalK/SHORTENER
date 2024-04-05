/**
 * The module for managing the interaction to the Shortener collection
 * @module ShortenerRepository
 */

import mongoose from 'mongoose';
import WrapperRepository from '@repositories/wrapper/wrapper.repository';
import { ShortenerType } from '@interfaces/shortener.interface';
import ShortenerModel from '@models/shortener.model';

/**
 * Class for managing the interaction to the shortener collection
 */
class ShortenerRepository extends WrapperRepository {
  private static instance: ShortenerRepository;
  #conn;

  /**
   * Constructor of the ShortenerRepository
   * @param model {Object} The shortener mongoose model
   */
  private constructor(dependencies) {
    super(dependencies.model);
    this.#conn = dependencies.orm.connection;
  }

  public static getInstance(dependencies) {
    if (!ShortenerRepository.instance) {
      ShortenerRepository.instance = new ShortenerRepository(dependencies);
    }

    return ShortenerRepository.instance;
  }

  getObj<ShortenerType>(data): ShortenerType {
    return this.make(data);
  }

  /**
   * Save a shortener object
   * @param tmpShortened The shortener object to save to the db
   * @returns {Object} The saved shortener object
   */
  async save(tmpShortened: ShortenerType): Promise<ShortenerType> {
    let result;
    const session = await this.#conn.startSession();
    try {
      session.startTransaction();
      result = await ShortenerModel.create([tmpShortened], { session });

      await session.commitTransaction();
      console.log('SUCCESS');
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    }
    session.endSession();
    console.log(result);
    return result[0];
  }

  /**
   * Return a shortener gotten by the short URL
   * @param shortURL The short url of the shortener to find
   * @returns {Object} The found shortener object
   */
  async getByShortUrl({ shortURL }: ShortenerType): Promise<ShortenerType> {
    return this.findOne<ShortenerType, { shortURL: string }>({ shortURL });
  }

  /**
   * Return a shortener gotten by the long URL
   * @param longURL The long url of the shortener to find
   * @returns {Object} The found shortener object
   */
  async getByLongUrl({ longURL }: ShortenerType): Promise<ShortenerType> {
    return this.findOne<ShortenerType, { longURL: string }>({ longURL });
  }

  /**
   * Increment count of a shortener object with a certain shortURL
   * @param shortURL The short url of the shortener to find
   * @returns {Object} The updated shortener object
   */
  async incrementByShortUrl(
    { shortURL }: ShortenerType,
    field: string
  ): Promise<ShortenerType> {
    return this.increment<ShortenerType, { shortURL: string }>(
      { shortURL },
      field
    );
  }

  /**
   * Update a shortener object with a certain shortURL
   * @param shortURL The short url of the shortener to find
   * @param longURL The long url of the shortener to update with
   * @returns {Object} The updated shortener object
   */
  async updateByShortUrl({
    shortURL,
    longURL,
  }: ShortenerType): Promise<ShortenerType> {
    return this.update<ShortenerType, { shortURL: string }>(
      { shortURL },
      { longURL, isArchive: false, countUsage: 0 }
    );
  }

  /**
   * Check if a shortener object exist by is longURL and by is shortURL
   * @param shortURL The short url of the shortener to find
   * @param longURL The long url of the shortener to find
   * @returns {Object} The result of both queries
   */
  async isExist({
    longURL,
    shortURL,
  }: {
    longURL: string;
    shortURL: string;
  }): Promise<{
    longURL: ShortenerType[];
    shortURL: ShortenerType[];
  }> {
    const query1 = this.queryMatch<{ longURL: string }>({ longURL });
    const query2 = this.queryMatch<{ shortURL: string }>({ shortURL });
    const limit = this.queryLimit<number>(1);

    const result = await this.facet<
      { longURL: string; shortURL: string },
      {
        longURL: ({ $match: { longURL: string } } | { $limit: number })[];
        shortURL: ({ $match: { shortURL: string } } | { $limit: number })[];
      }
    >({
      longURL: [query1, limit],
      shortURL: [query2, limit],
    });

    return result[0];
  }
}

export default ShortenerRepository.getInstance({
  model: ShortenerModel,
  orm: mongoose,
});
