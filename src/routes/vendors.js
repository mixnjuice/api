import { Router } from 'express';
import { param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('vendors');
const { Vendor } = models;

/**
 * GET Vendors
 * @param page int
 */
router.get(
  '/:page',
  authenticate(),
  [
    param('page')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const limit = 20; // Make this configurable

    let offset = 0;

    log.info(`request for page ${req.params.page}`);
    try {
      // const rows = Recipe.findAndCountAll();
      // const pages = Math.ceil(rows.count / limit);
      offset = limit * (req.params.page - 1);

      const result = await Vendor.findAll({
        limit: limit,
        offset: offset
      });

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
