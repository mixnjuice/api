import { Router } from 'express';
import { param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('vendor');
const { Vendor } = models;

/**
 * GET Vendor
 * @param id int
 */
router.get(
  '/:id(\\d+)',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for vendor ${req.params.id}`);
    try {
      const result = await Vendor.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!result) {
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
