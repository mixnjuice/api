import { Router } from 'express';
import { query, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('users');
const { User, UserProfile } = models;

/**
 * GET Users' Profiles
 * @param page int
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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const limit = req.query.limit || 20;

    let offset = req.query.offset || 1;

    log.info(`request for user profiles ${limit}`);
    try {
      // const rows = Recipe.findAndCountAll();
      // const pages = Math.ceil(rows.count / limit);
      offset--;

      const result = await UserProfile.findAll({
        limit: limit,
        offset: offset
      });

      if (result[0].length === 0) {
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

/**
 * GET Users' Accounts
 * @param page int
 */
router.get(
  '/accounts',
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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const limit = req.query.limit || 20;

    let offset = req.query.offset || 1;

    log.info(`request for user accounts ${limit}`);
    try {
      // const rows = Recipe.findAndCountAll();
      // const pages = Math.ceil(rows.count / limit);
      offset--;

      const result = await User.findAll({
        limit: limit,
        offset: offset
      });

      if (result[0].length === 0) {
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
