import { Router } from 'express';
import { query } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import { handleFindAll, handleValidationErrors } from 'modules/utils/request';

const router = Router();
const log = loggers('preparations');
const { Preparation } = models;

/**
 * GET Preparations
 * @query offset int
 * @query limit int
 */
router.get(
  '/',
  authenticate(),
  ensurePermission('preparations', 'read'),
  [
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(Preparation, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for preparations ${limit}`);
    return { limit, offset };
  })
);

export default router;
