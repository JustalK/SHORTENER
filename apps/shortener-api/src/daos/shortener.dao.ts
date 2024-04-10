/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoutes
 */

import express from 'express';
import ExceptionService from '@services/exception.service';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { CustomRequest } from '@interfaces/response.interface';
import { ExceptionType } from '@root/types';
import { STATUS, ERROR } from '@libs/constants';
import axios from 'axios';
import { z } from 'zod';

/**
 * Class for the shortener POST route
 */
class ShortenerDao {
  private static instance: ShortenerDao;
  #exceptionService: ExceptionServiceType;
  #saveShortURLValidatorSchema = z.object({
    longURL: z.string(),
  });
  #redirectToLongURLSchema = z.object({
    short: z.string(),
  });

  /**
   * Constructor of the ShortenerRepository
   * @param model {Object} The shortener mongoose model
   */
  private constructor(dependencies: {
    exceptionService: ExceptionServiceType;
  }) {
    this.#exceptionService = dependencies.exceptionService;
  }

  public static getInstance(dependencies: {
    exceptionService: ExceptionServiceType;
  }) {
    if (!ShortenerDao.instance) {
      ShortenerDao.instance = new ShortenerDao(dependencies);
    }

    return ShortenerDao.instance;
  }

  /**
   * Check if the body parameter longURL is valid
   * @param req {Express.Request} The request from express
   * @returns {null|Exception} Return exception if longURL is not value or else nothing
   */
  async saveShortURLValidator(
    req: CustomRequest<{ longURL: string }>
  ): Promise<ExceptionType | null> {
    try {
      this.#saveShortURLValidatorSchema.parse(req.body);
    } catch (_error: unknown) {
      return this.#exceptionService.createException(ERROR.X0002.KEY);
    }

    const { longURL }: { longURL?: string } = req.body;

    try {
      new URL(longURL);
    } catch (_error: unknown) {
      return this.#exceptionService.createException(ERROR.X0003.KEY);
    }

    try {
      const result = await axios.get(longURL);
      if (result.status !== STATUS.SUCCESS) {
        return this.#exceptionService.createException(ERROR.X0011.KEY);
      }
    } catch (_error: unknown) {
      return this.#exceptionService.createException(ERROR.X0011.KEY);
    }
  }

  /**
   * Check if the short url param is valid, if not create an exception
   * @param req {Express.Request} The request of Express
   * @returns {void|Exception} Return an exception if the short url is not valid or else nothing
   */
  redirectToLongURLValidator(req: express.Request): ExceptionType | null {
    try {
      this.#redirectToLongURLSchema.parse(req.params);
    } catch (_error: unknown) {
      return this.#exceptionService.createException(ERROR.X0006.KEY);
    }
  }
}

export default ShortenerDao.getInstance({
  exceptionService: ExceptionService,
});
