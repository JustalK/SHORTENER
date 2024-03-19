/**
 * The module for creating a logger that print to the console for the moment
 * @module Logger
 */

import winston from 'winston';
import ENVIRONMENT from '@src/environment';

const logger = winston.createLogger({
  level: ENVIRONMENT.API.LOG_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
