/**
 * Just a healthcheck to check if the api is up and running
 */

import express from 'express';
import ENVIRONMENT from '@src/environment';
import { STATUS } from '@libs/constants';
const router = express.Router();

router.get('/healthcheck', (_req: express.Request, res: express.Response) => {
  res.send({ status: 'running' });
});

router.get("*", (req: express.Request, res: express.Response) => {
  res.redirect(STATUS.REDIRECT, ENVIRONMENT.APP.FRONT_URL);
});

module.exports = router;
