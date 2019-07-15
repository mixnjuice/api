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

    let offset = req.query.offset || 1;

    log.info(`request for user profiles ${limit}`);
    try {
      // const rows = UserProfile.findAndCountAll();
      // const pages = Math.ceil(rows.count / limit);
      offset--;

      const result = await UserProfile.findAll({
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

    let offset = req.query.offset || 1;

    log.info(`request for user accounts ${limit}`);
    try {
      // const rows = User.findAndCountAll();
      // const pages = Math.ceil(rows.count / limit);
      offset--;

      const result = await User.findAll({
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
/**
 * GET Role Users
 * @param roleid int
 */
router.get(
  '/role/:roleid(\\d+)',
  authenticate(),
  [
    param('roleid')
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

    let offset = req.query.offset || 1;

    log.info(`request for all users with role id ${req.params.roleid}`);
    try {
      offset--;
      const result = await UsersRoles.findAll({
        where: {
          roleId: req.params.roleid
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
        limit: limit,
        offset: offset
      });

      if (!result || result.length === 0) {
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
