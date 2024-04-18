/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoute
 */

import express from 'express';
import ShortenerController from '@controllers/shortener.controller';
import { ShortenerControllerType } from '@interfaces/shortener.interface';
import { ShortenerRouteType } from '@interfaces/route.interface';
import ENVIRONMENT from '@src/environment';
import Base from '@libs/base';

const router = express.Router();

/**
 * Class for the shortener POST route
 */
export class ShortenerRoute extends Base {
  private static instance: ShortenerRoute;
  #router: express.Router;
  #shortenerController: ShortenerControllerType;

  private constructor(dependencies: ShortenerRouteType) {
    super();
    this.#router = dependencies.router;
    this.#shortenerController = dependencies.shortenerController;
    this.#init();
  }

  public static getInstance(dependencies: ShortenerRouteType): ShortenerRoute {
    if (!ShortenerRoute.instance || ENVIRONMENT.MODE === 'test') {
      ShortenerRoute.instance = new ShortenerRoute(dependencies);
    }

    return ShortenerRoute.instance;
  }

  /**
   * Method for setting the route handling the save of links
   */
  #init(): void {
    this.#router.post('/', this.handlePost.bind(this));
  }

  /**
   * Save the longUrl and shorten it if possible
   * @param req {Express.Request} The request of express
   * @param res {Express.Response} the response of express
   *
   * @swagger
   * /v1/shortener:
   *   post:
   *     summary: Check if the server is running
   *     description: Check the status of the server
   *     tags:
   *       - Shortener
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               longURL:
   *                 type: string
   *                 description: URL to shorten
   *                 example: https://www.npmjs.com/package/prettier
   *     responses:
   *       200:
   *         description: Status of the server.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 longURL:
   *                   type: string
   *                 shortURL:
   *                   type: string
   *                 countUsage:
   *                   type: number
   */
  async handlePost(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return this.#shortenerController.saveShortURL(req, res);
  }
}

ShortenerRoute.getInstance({
  shortenerController: ShortenerController,
  router,
});

export default router;
