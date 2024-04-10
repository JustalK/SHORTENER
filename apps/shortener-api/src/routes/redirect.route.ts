/**
 * The service for managing everything related to the redirection to the long URL
 * @module RedirectRoutes
 */

import express from 'express';
import ShortenerController from '@controllers/shortener.controller';
import { ShortenerControllerType } from '@interfaces/shortener.interface';
import { ShortenerRouteType } from '@interfaces/route.interface';
import Base from '@libs/base';
const router = express.Router();

/**
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 **/

/**
 * Class handling the redirect routes
 */
class RedirectRoute extends Base {
  private static instance: RedirectRoute;
  #router: express.Router;
  #shortenerController: ShortenerControllerType;

  private constructor(dependencies: ShortenerRouteType) {
    super();
    this.#router = dependencies.router;
    this.#shortenerController = dependencies.shortenerController;
    this.#init();
  }

  public static getInstance(dependencies: ShortenerRouteType): RedirectRoute {
    if (!RedirectRoute.instance) {
      RedirectRoute.instance = new RedirectRoute(dependencies);
    }

    return RedirectRoute.instance;
  }

  /**
   * Method for setting the route handling the short discovery url
   */
  #init(): void {
    this.#router.get('/:short', this.handleGet.bind(this));
  }

  /**
   * Search for a long URL to redirect to
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   *
   * @swagger
   * /{short}:
   *   get:
   *     summary: Redirect to the long url
   *     description: Redirect to the long url based on the short url
   *     tags:
   *       - Redirect
   *     parameters:
   *       - name: short
   *         in: path
   *         description: The short url to search
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       301:
   *         description: Redirect to the home page
   */
  async handleGet(
    req: express.Request,
    res: express.Response
  ): Promise<void | express.Response> {
    return this.#shortenerController.redirectToLongURL(req, res);
  }
}

RedirectRoute.getInstance({
  shortenerController: ShortenerController,
  router,
});

export default router;
