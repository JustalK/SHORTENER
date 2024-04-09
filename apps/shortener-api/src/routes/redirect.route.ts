/**
 * The service for managing everything related to the redirection to the long URL
 * @module RedirectRoutes
 */

import express from 'express';
import ShortenerController from '@controllers/shortener.controller';
import Base from '@libs/base';

const router = express.Router();

/**
 * Class handling the redirect routes
 */
class RedirectRoute extends Base {
  private static instance: RedirectRoute;
  #router: express.Router;
  #shortenerController;

  private constructor(dependencies) {
    super();
    this.#router = dependencies.router;
    this.#shortenerController = dependencies.shortenerController;
    this.#init();
  }

  public static getInstance(dependencies) {
    if (!RedirectRoute.instance) {
      RedirectRoute.instance = new RedirectRoute(dependencies);
    }

    return RedirectRoute.instance;
  }

  /**
   * Method for setting the route handling the short discovery url
   */
  #init() {
    this.#router.get('/:short', this.handleGet.bind(this));
  }

  /**
   * Search for a long URL to redirect to
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async handleGet(req: express.Request, res: express.Response) {
    return this.#shortenerController.redirectToLongURL(req, res);
  }
}

RedirectRoute.getInstance({
  shortenerController: ShortenerController,
  router,
});

module.exports = router;
