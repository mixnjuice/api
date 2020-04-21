import { Router } from 'express';
import { query } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import { handleFindAll, handleValidationErrors } from 'modules/utils/request';

const router = Router();
const log = loggers('recipes');
const { Recipe } = models;

/**
 * GET Recipes
 * @query offset int
 * @query limit int
 */
router.get(
  '/',
  authenticate(),
  ensurePermission('recipes', 'read'),
  [
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(Recipe, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`Request for ${limit} recipes starting from ${offset}`);
    return { limit, offset };
  })
);

export default router;
