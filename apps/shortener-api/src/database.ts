/**
 * The module for managing everything related to the database
 * @module Database
 */

import mongoose from 'mongoose';
import ENVIRONMENT from '@src/environment';
import Base from '@libs/base';

/**
 * Class for connecting to the mongoDB instance
 */
class Database extends Base {
  // The mongoose ORM
  #mongoose: typeof import('mongoose');
  // The mongoDB uri
  #uri: string;

  /**
   * Constructor for the database
   * @param mongoose The mongoose ORM
   * @param uri {string} The uri of the mongoDB instance
   */
  constructor(uri: string) {
    super();
    this.#mongoose = mongoose;
    this.#uri = uri;
    this.#init();
  }

  /**
   * Initialize the database by connecting to the mongoDB instance
   */
  #init() {
    try {
      this.#mongoose.connect(this.#uri);
      this.logger.info(`[Database.init] DB Connection to ${this.#uri}`);
    } catch (_error: unknown) {
      this.logger.error(
        '[Database.init] An error occured when connecting to the DB'
      );
    }
  }
}

const database = new Database(ENVIRONMENT.DATABASE.URI);

export default database;
