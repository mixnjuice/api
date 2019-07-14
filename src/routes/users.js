import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('recipes');
const { UserProfile } = models;

/**
 * GET Users
 * @param page int
 */
router.get(
  '/:page(d+)',
  [
    check('page')
      .isNumeric()
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

      const result = await UserProfile.findAll({
        limit: limit,
        offset: offset
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
