/**
 * Just a healthcheck to check if the api is up and running
 */

import express from 'express';
const router = express.Router();

router.get('/healthcheck', (_req: express.Request, res: express.Response) => {
  res.send({ status: 'running' });
});

module.exports = router;
