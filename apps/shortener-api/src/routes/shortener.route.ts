/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoute
 */

import express from 'express';
import ShortenerController from '@controllers/shortener.controller';
import Base from '@libs/base';

const router = express.Router();

/**
 * Class for the shortener POST route
 */
class ShortenerRoute extends Base {
  private static instance: ShortenerRoute;
  #router: express.Router;
  #shortenerController;

  private constructor(dependencies) {
    super();
    this.#router = dependencies.router;
    this.#shortenerController = dependencies.shortenerController;
    this.#init();
  }

  public static getInstance(dependencies) {
    if (!ShortenerRoute.instance) {
      ShortenerRoute.instance = new ShortenerRoute(dependencies);
    }

    return ShortenerRoute.instance;
  }

  /**
   * Method for setting the route handling the save of links
   */
  #init() {
    this.#router.post('/', this.handlePost.bind(this));
  }

  /**
   * Save the longUrl and shorten it if possible
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   */
  async handlePost(req: express.Request, res: express.Response) {
    return this.#shortenerController.saveShortURL(req, res);
  }
}

ShortenerRoute.getInstance({
  shortenerController: ShortenerController,
  router,
});

module.exports = router;
