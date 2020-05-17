import { Router } from 'express';
import { query } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleCount,
  handleFindAll,
  handleValidationErrors
} from 'modules/utils/request';

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
  ensurePermission('vendors', 'read'),
  [
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(Vendor, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for vendors ${limit}`);
    return { limit, offset };
  })
);

/**
 * GET Vendor Stats
 */
router.get(
  '/count',
  authenticate(),
  ensurePermission('vendors', 'read'),
  handleCount(Vendor)
);

export default router;
