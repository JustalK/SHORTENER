/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoute
 */

import express from 'express';
import ShortenerController from '@controllers/shortener.controller';
import Base from '@libs/base';
import ENVIRONMENT from '@src/environment';
import { STATUS } from '@libs/constants';

const router = express.Router();

/**
 * Class for the shortener POST route
 */
class ServerRoute extends Base {
  private static instance: ServerRoute;
  #router: express.Router;
  #shortenerController;

  private constructor(dependencies) {
    super();
    this.#router = dependencies.router;
    this.#shortenerController = dependencies.shortenerController;
    this.#init();
  }

  public static getInstance(dependencies) {
    if (!ServerRoute.instance) {
      ServerRoute.instance = new ServerRoute(dependencies);
    }

    return ServerRoute.instance;
  }

  /**
   * Method for setting the route handling the save of links
   */
  #init() {
    this.#router.get(
      `/${ENVIRONMENT.API.VERSION}/server/healthcheck`,
      this.handleRedirect.bind(this)
    );
    this.#router.get('*', this.handleRedirect.bind(this));
  }

  async handleHealthcheck(_req: express.Request, res: express.Response) {
    return res.send({ status: 'running' });
  }

  /**
   * Save the longUrl and shorten it if possible
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async handleRedirect(_req: express.Request, res: express.Response) {
    return res.redirect(STATUS.REDIRECT, ENVIRONMENT.APP.FRONT_URL);
  }
}

ServerRoute.getInstance({
  shortenerController: ShortenerController,
  router,
});

module.exports = router;
