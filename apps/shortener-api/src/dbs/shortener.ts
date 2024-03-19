/**
 * The module for managing the interaction to the Shortener collection
 * @module ShortenerDb
 */

import WrapperDb from '@dbs/wrapper/WrapperDb';

/**
 * Class for managing the interaction to the shortener collection
 */
class ShortenerDb extends WrapperDb {
  /**
   * Constructor of the ShortenerDB
   * @param model {Object} The shortener mongoose model
   */
  constructor(model) {
    super(model);
  }

  /**
   * Save a shortener object
   * @param tmpShortened The shortener object to save to the db
   * @returns {Object} The saved shortener object
   */
  async save(tmpShortened) {
    return this.create(tmpShortened);
  }

  /**
   * Return a shortener gotten by the short URL
   * @param shortURL The short url of the shortener to find
   * @returns {Object} The found shortener object
   */
  async getByShortUrl({ shortURL }) {
    return this.findOne({ shortURL });
  }

  /**
   * Return a shortener gotten by the long URL
   * @param longURL The long url of the shortener to find
   * @returns {Object} The found shortener object
   */
  async getByLongUrl({ longURL }) {
    return this.findOne({ longURL });
  }

  /**
   * Increment count of a shortener object with a certain shortURL
   * @param shortURL The short url of the shortener to find
   * @returns {Object} The updated shortener object
   */
  async incrementByShortUrl({ shortURL }, field: string) {
    return this.increment({ shortURL }, field);
  }

  /**
   * Update a shortener object with a certain shortURL
   * @param shortURL The short url of the shortener to find
   * @param longURL The long url of the shortener to update with
   * @returns {Object} The updated shortener object
   */
  async updateByShortUrl({ shortURL, longURL }) {
    return this.update(
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
  async isExist({ longURL, shortURL }) {
    const query1 = this.queryMatch({ longURL });
    const query2 = this.queryMatch({ shortURL });
    const limit = this.queryLimit(1);

    const result = await this.facet({
      longURL: [query1, limit],
      shortURL: [query2, limit],
    });

    return result[0];
  }
}

export default ShortenerDb;
