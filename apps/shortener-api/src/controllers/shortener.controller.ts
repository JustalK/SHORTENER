/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoutes
 */

import express from 'express';
import ShortenerService from '@services/shortener.service';
import ExceptionService from '@services/exception.service';
import Base from '@libs/base';
import { ShortenerServiceType } from '@interfaces/shortener.interface';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { ShortenerType, ExceptionType } from '@root/types';
import ENVIRONMENT from '@src/environment';
import { STATUS, ERROR } from '@libs/constants';
import axios from 'axios';

/**
 * Class for the shortener POST route
 */
class ShortenerController extends Base {
  private static instance: ShortenerController;
  #shortenerService: ShortenerServiceType;
  #exceptionService: ExceptionServiceType;

  /**
   * Constructor of the ShortenerRepository
   * @param model {Object} The shortener mongoose model
   */
  private constructor(dependencies) {
    super();
    this.#shortenerService = dependencies.shortenerService;
    this.#exceptionService = dependencies.exceptionService;
  }

  public static getInstance(dependencies) {
    if (!ShortenerController.instance) {
      ShortenerController.instance = new ShortenerController(dependencies);
    }

    return ShortenerController.instance;
  }

  /**
   * Check if the body parameter longURL is valid
   * @param req {Express.Request} The request from express
   * @returns {null|Exception} Return exception if longURL is not value or else nothing
   */
  async handlePostReqValidator(
    req: express.Request
  ): Promise<ExceptionType | null> {
    if (!req.body) {
      return this.#exceptionService.createException(ERROR.X0001.KEY);
    }

    const { longURL }: { longURL: string | null } = req.body;
    if (!longURL) {
      return this.#exceptionService.createException(ERROR.X0002.KEY);
    }

    try {
      new URL(longURL);
    } catch (err) {
      return this.#exceptionService.createException(ERROR.X0003.KEY);
    }

    try {
      const result = await axios.get(longURL);
      if (result.status !== STATUS.SUCCESS) {
        return this.#exceptionService.createException(ERROR.X0011.KEY);
      }
    } catch (e: unknown) {
      return this.#exceptionService.createException(ERROR.X0011.KEY);
    }
  }

  /**
   * Save the longUrl and shorten it if possible
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async saveShortURL(req: express.Request, res: express.Response) {
    this.logger.debug('[ShortenerRoutes.handlePost] New attempt');

    // Check if the parameter is valid
    const error = await this.handlePostReqValidator(req);
    if (error) {
      return res.status(STATUS.ERROR).send({ error });
    }

    // Get the parameter
    const { longURL } = req.body;
    let newShortened: ShortenerType | null = null;

    try {
      // Try to shorten the URL
      newShortened = await this.#shortenerService.shortenUrl(longURL);
    } catch (error: unknown) {
      // Handle gracefully the unexpected error
      this.logger.error(
        `[ShortenerRoutes.handlePost] Unexpected error occured: ${JSON.stringify(
          error
        )}`
      );
      const unexpectedError = this.#exceptionService.createException(
        ERROR.X0004.KEY
      );
      return res.status(STATUS.ERROR).send({ error: unexpectedError });
    }

    // Limit the request to longURL and shortURL
    const response = newShortened.toDTO(['longURL', 'shortURL', 'countUsage']);
    this.logger.debug('[ShortenerRoutes.handlePost] Success');
    res.status(STATUS.SUCCESS).send(response);
  }

  /**
   * Check if the short url param is valid, if not create an exception
   * @param req {Express.Request} The request of Express
   * @returns {void|Exception} Return an exception if the short url is not valid or else nothing
   */
  handleGetReqValidator(req: express.Request): ExceptionType | null {
    if (!req.params) {
      return this.#exceptionService.createException(ERROR.X0005.KEY);
    }

    const { short }: { short?: string } = req.params;
    if (!short) {
      return this.#exceptionService.createException(ERROR.X0006.KEY);
    }
  }

  /**
   * Search for a long URL to redirect to
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async redirectToLongURL(req: express.Request, res: express.Response) {
    this.logger.debug('[RedirectRoutes.handleGet] New attempt');
    const error = this.handleGetReqValidator(req);
    if (error) {
      return res.status(STATUS.ERROR).send({ error });
    }

    const { short }: { short?: string } = req.params;

    let tmpShortened: ShortenerType | null = null;
    try {
      tmpShortened = await this.#shortenerService.getShortenUrl(short);
    } catch (error: unknown) {
      // Handle gracefully the unexpected error
      this.logger.error(
        `[ShortenerRoutes.handlePost] Unexpected error occured: ${JSON.stringify(
          error
        )}`
      );
      const unexpectedError = this.#exceptionService.createException(
        ERROR.X0004.KEY
      );
      return res.status(STATUS.ERROR).send({ error: unexpectedError });
    }

    if (!tmpShortened) {
      return res.redirect(
        STATUS.REDIRECT,
        `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0010.KEY}`
      );
    }

    const isExpired = this.#shortenerService.isExpired(tmpShortened);

    if (isExpired) {
      return res.redirect(
        STATUS.REDIRECT,
        `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0008.KEY}`
      );
    }

    const { longURL } = tmpShortened;
    this.logger.debug('[RedirectRoutes.handleGet] Success');
    res.redirect(STATUS.REDIRECT, longURL);
  }
}

export default ShortenerController.getInstance({
  shortenerService: ShortenerService,
  exceptionService: ExceptionService,
});
