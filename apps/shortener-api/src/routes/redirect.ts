/**
 * The service for managing everything related to the redirection to the long URL
 * @module RedirectRoutes
 */

import express from 'express';
import shortenerService from '@services/shortener';
import exceptionService from '@services/exception';
import { ShortenerServiceType, ShortenerType } from '@interfaces/shortener';
import { ExceptionServiceType, ExceptionType } from '@interfaces/error';
import { STATUS, ERROR } from '@libs/constants';
import ENVIRONMENT from '@src/environment';
import Base from '@libs/base';
const router = express.Router();

/**
 * Class handling the redirect routes
 */
class RedirectRoutes extends Base {
  #router: express.Router;
  #shortenerService: ShortenerServiceType;
  #exceptionService: ExceptionServiceType;

  /**
   * Constructor for the routes handling the short discovery route
   * @param shortenerService {Object} The service managing the shorteners
   * @param exceptionService {Object} The service managing the exceptions
   */
  constructor(
    shortenerService: ShortenerServiceType,
    exceptionService: ExceptionServiceType
  ) {
    super();
    this.#router = router;
    this.#shortenerService = shortenerService;
    this.#exceptionService = exceptionService;
    this.#init();
  }

  /**
   * Method for setting the route handling the short discovery url
   */
  #init() {
    this.#router.get('/:short', this.handleGet.bind(this));
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
  async handleGet(req: express.Request, res: express.Response) {
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
      return res.redirect(STATUS.REDIRECT, `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0010.KEY}`);
    }

    const isExpired = this.#shortenerService.isExpired(tmpShortened);

    if (isExpired) {
      return res.redirect(STATUS.REDIRECT, `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0008.KEY}`);
    }

    const { longURL } = tmpShortened;
    this.logger.debug('[RedirectRoutes.handleGet] Success');
    res.redirect(STATUS.REDIRECT, longURL);
  }
}

new RedirectRoutes(shortenerService, exceptionService);

module.exports = router;
