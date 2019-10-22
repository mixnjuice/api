import { Router } from 'express';
import { query, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('users');
const { Role, User, UserProfile, UsersRoles } = models;

/**
 * GET Users' Profiles
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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const limit = req.query.limit || 20;

    const offset = req.query.offset - 1 || 0;

    log.info(`request for user profiles ${limit}`);
    try {
      const result = await UserProfile.findAll({
        limit,
        offset
      });

      if (!Array.isArray(result) || result.length === 0) {
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
 * @query offset int
 * @query limit int
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

    const offset = req.query.offset - 1 || 0;

    log.info(`request for user accounts ${limit}`);
    try {
      const result = await User.findAll({
        limit,
        offset
      });

      if (!Array.isArray(result) || result.length === 0) {
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
 * GET Role Users
 * @param roleid int
 */
router.get(
  '/role/:roleId(\\d+)',
  authenticate(),
  [
    param('roleId')
      .isNumeric()
      .toInt(),
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
    const offset = req.query.offset - 1 || 0;
    const { roleId } = req.params;

    log.info(`request for all users with role id ${roleId}`);
    try {
      const result = await UsersRoles.findAll({
        where: {
          roleId
        },
        include: [
          {
            model: Role,
            required: true
          },
          {
            model: User,
            required: true
          }
        ],
        limit,
        offset
      });

      if (!Array.isArray(result) || result.length === 0) {
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
 * GET User Stats
 */
router.get('/count', authenticate(), async (req, res) => {
  log.info(`request for user stats`);
  try {
    // User Stats
    const result = await User.count();

    res.type('application/json');
    res.json(result);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

export default router;
