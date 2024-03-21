/**
 * The module for managing everything related to the database
 * @module Base
 */
'use strict';

import logger from '@libs/logger';
import winston from 'winston';

/**
 * Class for connecting to the mongoDB instance
 */
class Base {
  // The winston logger
  logger: winston.Logger;

  /**
   * Constructor for the database
   * @param logger The winston logger
   */
  constructor() {
    this.logger = logger;
  }
}

export default Base;
