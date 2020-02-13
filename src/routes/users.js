import { Router } from 'express';
import { query, param } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  countAll,
  fetchAll,
  handleValidationErrors
} from 'modules/utils/request';

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
  handleValidationErrors(),
  req => {
    const limit = req.query.limit || 20;

    const offset = req.query.offset - 1 || 0;

    log.info(`request for user profiles ${limit}`);
    return fetchAll(UserProfile, { limit, offset });
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
  handleValidationErrors(),
  req => {
    const limit = req.query.limit || 20;

    const offset = req.query.offset - 1 || 0;

    log.info(`request for user accounts ${limit}`);
    return fetchAll(User, { limit, offset });
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
  handleValidationErrors(),
  req => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;
    const { roleId } = req.params;

    log.info(`request for all users with role id ${roleId}`);
    return fetchAll(UsersRoles, {
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
  }
);

/**
 * GET User Stats
 */
router.get('/count', authenticate(), countAll(User));

export default router;
