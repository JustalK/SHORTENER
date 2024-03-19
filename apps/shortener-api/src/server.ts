/**
 * The module for managing everything related to the server
 * @module Server
 */

import express = require('express');
import bodyParser from 'body-parser';
import cors from 'cors';
import ENVIRONMENT from '@src/environment';
import Base from '@libs/base';

/**
 * Class for creating the express server
 */
class Server extends Base {
  // The express server
  #app: express.Application;

  /**
   * Constructor for the server
   * @param logger The winston logger
   */
  constructor() {
    super();
    this.#app = express();
    this.#init();
  }

  /**
   * Initialize the server
   */
  #init() {
    this.#extensions();
    this.#routes();
    this.#start();
  }

  /**
   * Add the extension to be able to read the response in JSON
   * and to allow interaction between different server
   */
  #extensions() {
    this.#app.use(cors());
    this.#app.use(bodyParser.json());
    this.#app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }

  /**
   * Add the route to our express server
   */
  #routes() {
    this.#app.use('/', express.static(__dirname + '/../shortener'));
    this.#app.use('/', require('@routes/redirect'));
    this.#app.use(
      `/${ENVIRONMENT.API.VERSION}/shortener`,
      require('@routes/shortener')
    );
    this.#app.use(
      `/${ENVIRONMENT.API.VERSION}/server`,
      require('@routes/server')
    );
  }

  /**
   * Create the server with the right port and host
   */
  #start() {
    const protocol = ENVIRONMENT.SERVER.PROTOCOL;
    const host = ENVIRONMENT.SERVER.HOST;
    const port = ENVIRONMENT.SERVER.PORT;
    const server = this.#app.listen({ port, host }, () => {
      this.logger.info(
        `[Server.start] Listening at ${protocol}://${host}:${port}`
      );
    });
    server.on('error', (error) => {
      this.logger.error(error);
    });
  }
}

new Server();
