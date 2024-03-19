/**
 * Regroup all the environment variable
 */

import utils from '@libs/utils';
import dotenv from 'dotenv';
const mode = utils.mode(process.env.NODE_ENV);
dotenv.config({ path: './env/.env.' + mode });

/**
 * Constant for handling in a single point all the environment variable
 */
const ENVIRONMENT = {
  MODE: process.env.NODE_ENV,
  SERVER: {
    PROTOCOL: process.env.API_PROTOCOL,
    HOST: process.env.API_HOST,
    PORT: process.env.API_PORT,
  },
  API: {
    VERSION: process.env.API_VERSION,
    LOG_LEVEL: process.env.API_LOG_LEVEL,
  },
  APP: {
    EXPIRATION_IN_MINUTE: Number(process.env.EXPIRATION_IN_MINUTE),
  },
  DATABASE: {
    URI: process.env.DB_URI,
  },
};

export default ENVIRONMENT;
