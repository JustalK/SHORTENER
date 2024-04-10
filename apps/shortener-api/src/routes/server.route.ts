/**
 * The service for managing everything related to the routes of the shortener
 * @module ShortenerRoute
 */

import express from 'express';
import Base from '@libs/base';
import ENVIRONMENT from '@src/environment';
import { STATUS } from '@libs/constants';
import { RouteType } from '@interfaces/route.interface';
const router = express.Router();

/**
 * Class for the shortener POST route
 */
class ServerRoute extends Base {
  private static instance: ServerRoute;
  #router: express.Router;

  private constructor(dependencies: RouteType) {
    super();
    this.#router = dependencies.router;
    this.#init();
  }

  public static getInstance(dependencies: RouteType): ServerRoute {
    if (!ServerRoute.instance) {
      ServerRoute.instance = new ServerRoute(dependencies);
    }

    return ServerRoute.instance;
  }

  /**
   * Method for setting the route handling the save of links
   */
  #init(): void {
    this.#router.get(
      `/${ENVIRONMENT.API.VERSION}/server/healthcheck`,
      this.handleHealthcheck.bind(this)
    );
    this.#router.get('*', this.handleRedirect.bind(this));
  }

  /**
   * @swagger
   * /v1/server/healthcheck:
   *   get:
   *     summary: Check if the server is running
   *     description: Check the status of the server
   *     tags:
   *       - Server
   *     responses:
   *       200:
   *         description: Status of the server.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   */
  async handleHealthcheck(
    _req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.send({ status: 'running' });
  }

  /**
   * @swagger
   * /*:
   *   get:
   *     summary: Redirect to the home page
   *     description: Redirect to the home page if the user use a wrong url
   *     tags:
   *       - Server
   *     responses:
   *       301:
   *         description: Redirect to the home page
   */
  async handleRedirect(
    _req: express.Request,
    res: express.Response
  ): Promise<void> {
    return res.redirect(STATUS.REDIRECT, ENVIRONMENT.APP.FRONT_URL);
  }
}

ServerRoute.getInstance({
  router,
});

export default router;
