/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoutes
 */

import express from 'express';
import ShortenerService from '@services/shortener';
import ExceptionService from '@services/exception';
import Base from '@libs/base';
import { ShortenerServiceType, ShortenerType } from '@interfaces/shortener';
import { ExceptionServiceType, ExceptionType } from '@interfaces/error';
import { STATUS, ERROR } from '@libs/constants';
import axios from 'axios';

const router = express.Router();

/**
 * Class for the shortener POST route
 */
class ShortenerRoutes extends Base {
  #router: express.Router;
  #shortenerService: ShortenerServiceType;
  #exceptionService: ExceptionServiceType;

  /**
   * Constructor for the routes handling the short discovery route
   * @param shortenerService {Object} The service managing the shorteners
   * @param exceptionService {Object} The service managing the exceptions
   */
  constructor() {
    super();
    this.#router = router;
    this.#shortenerService = ShortenerService.getInstance();
    this.#exceptionService = ExceptionService.getInstance();
    this.#init();
  }

  /**
   * Method for setting the route handling the save of links
   */
  #init() {
    this.#router.post('/', this.handlePost.bind(this));
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
  async handlePost(req: express.Request, res: express.Response) {
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
}

new ShortenerRoutes();

module.exports = router;
