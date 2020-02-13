import { Router } from 'express';
import { query } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import { fetchAll, handleValidationErrors } from 'modules/utils/request';

const router = Router();
const log = loggers('vendors');
const { Vendor } = models;

/**
 * GET Vendors
 * @query offset int
 * @query limit int
 */
router.get(
  '/',
  authenticate(),
  [
    query('offset')
      .optional()
      .isNumeric()
      .toInt(),
    query('limit')
      .optional()
      .isNumeric()
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const limit = req.query.limit || 20;

    const offset = req.query.offset - 1 || 0;

    log.info(`request for vendors ${limit}`);
    return fetchAll(Vendor, { limit, offset });
  }
);
/**
 * GET Vendor Stats
 */
router.get('/count', authenticate(), async (req, res) => {
  log.info(`request for vendor stats`);
  try {
    const vendors = await Vendor.count();
    // Results
    const result = {
      vendors
    };

    res.type('application/json');
    res.json(result);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

export default router;
