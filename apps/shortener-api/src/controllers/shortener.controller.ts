/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoutes
 */

import express from 'express';
import ShortenerService from '@services/shortener.service';
import ExceptionService from '@services/exception.service';
import ShortenerDao from '@daos/shortener.dao';
import Base from '@libs/base';
import {
  ShortenerServiceType,
  ShortenerDaoType,
  ShortenerControllerDependenciesType,
} from '@interfaces/shortener.interface';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { CustomRequest } from '@interfaces/response.interface';
import { ExceptionType, ShortenerType } from '@root/types';
import ENVIRONMENT from '@src/environment';
import { STATUS, ERROR } from '@libs/constants';

/**
 * Class for the shortener POST route
 */
class ShortenerController extends Base {
  private static instance: ShortenerController;
  #shortenerService: ShortenerServiceType;
  #exceptionService: ExceptionServiceType;
  #shortenerDao: ShortenerDaoType;

  /**
   * Constructor of the ShortenerRepository
   * @param model {Object} The shortener mongoose model
   */
  private constructor(dependencies: ShortenerControllerDependenciesType) {
    super();
    this.#shortenerService = dependencies.shortenerService;
    this.#exceptionService = dependencies.exceptionService;
    this.#shortenerDao = dependencies.shortenerDao;
  }

  public static getInstance(
    dependencies: ShortenerControllerDependenciesType
  ): ShortenerController {
    if (!ShortenerController.instance) {
      ShortenerController.instance = new ShortenerController(dependencies);
    }

    return ShortenerController.instance;
  }

  /**
   * Save the longUrl and shorten it if possible
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async saveShortURL(
    req: CustomRequest<{ longURL: string }>,
    res: express.Response
  ): Promise<express.Response> {
    this.logger.debug('[ShortenerRoutes.handlePost] New attempt');

    // Check if the parameter is valid
    const error: ExceptionType = await this.#shortenerDao.saveShortURLValidator(
      req
    );
    if (error) {
      return res.status(STATUS.ERROR).send({ error });
    }

    // Get the parameter
    const { longURL }: { longURL: string } = req.body;
    let newShortened: ShortenerType;

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
      const unexpectedError: ExceptionType =
        this.#exceptionService.createException(ERROR.X0004.KEY);
      return res.status(STATUS.ERROR).send({ error: unexpectedError });
    }

    // Limit the request to longURL and shortURL
    const response: Partial<ShortenerType> = newShortened.toDTO([
      'longURL',
      'shortURL',
      'countUsage',
    ]);
    this.logger.debug('[ShortenerRoutes.handlePost] Success');
    res.status(STATUS.SUCCESS).send(response);
  }

  /**
   * Search for a long URL to redirect to
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async redirectToLongURL(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> {
    this.logger.debug('[RedirectRoutes.handleGet] New attempt');
    const error: ExceptionType =
      this.#shortenerDao.redirectToLongURLValidator(req);
    if (error) {
      return res.status(STATUS.ERROR).send({ error });
    }

    const { short }: { short?: string } = req.params;

    let tmpShortened: ShortenerType;
    try {
      tmpShortened = await this.#shortenerService.getShortenUrl(short);
    } catch (error: unknown) {
      // Handle gracefully the unexpected error
      this.logger.error(
        `[ShortenerRoutes.handlePost] Unexpected error occured: ${JSON.stringify(
          error
        )}`
      );
      const unexpectedError: ExceptionType =
        this.#exceptionService.createException(ERROR.X0004.KEY);
      return res.status(STATUS.ERROR).send({ error: unexpectedError });
    }

    if (!tmpShortened) {
      return res.redirect(
        STATUS.REDIRECT,
        `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0010.KEY}`
      );
    }

    const isExpired: boolean = this.#shortenerService.isExpired(tmpShortened);

    if (isExpired) {
      return res.redirect(
        STATUS.REDIRECT,
        `${ENVIRONMENT.APP.FRONT_URL}?error=${ERROR.X0008.KEY}`
      );
    }

    const { longURL }: { longURL: string } = tmpShortened;
    this.logger.debug('[RedirectRoutes.handleGet] Success');
    res.redirect(STATUS.REDIRECT, longURL);
  }
}

export default ShortenerController.getInstance({
  shortenerService: ShortenerService,
  exceptionService: ExceptionService,
  shortenerDao: ShortenerDao,
});
