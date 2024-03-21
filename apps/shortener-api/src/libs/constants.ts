/**
 * The module for regrouping all the constant in one place
 * @module Constant
 */

// Status code for the express api
export const STATUS = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  EXPIRED: 410,
  REDIRECT: 301,
  ERROR: 500,
};

// Error possible for the api
export const ERROR = {
  X0001: {
    KEY: 'X0001',
    MESSAGE: 'You need a body',
  },
  X0002: {
    KEY: 'X0002',
    MESSAGE: 'You need a longURL parameter',
  },
  X0003: {
    KEY: 'X0003',
    MESSAGE: 'This is not a valid URL',
  },
  X0004: {
    KEY: 'X0004',
    MESSAGE: 'Unexpected error occured',
  },
  X0005: {
    KEY: 'X0005',
    MESSAGE: 'You need a query',
  },
  X0006: {
    KEY: 'X0006',
    MESSAGE: 'You need a short query parameter',
  },
  X0007: {
    KEY: 'X0007',
    MESSAGE: 'No short url found',
  },
  X0008: {
    KEY: 'X0008',
    MESSAGE: 'Link expired',
  },
  X0009: {
    KEY: 'X0009',
    MESSAGE: 'This is not a valid link',
  },
  X0010: {
    KEY: 'X0010',
    MESSAGE: 'No Link Found',
  },
  X0011: {
    KEY: 'X0011',
    MESSAGE: 'The url is not reachable',
  },
};
