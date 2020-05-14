import { Router } from 'express';
import { query, param } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleCount,
  handleFindAll,
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
  ensurePermission('user', 'read'),
  [
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(UserProfile, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for user profiles ${limit}`);
    return { limit, offset };
  })
);

/**
 * GET Users' Accounts
 * @query offset int
 * @query limit int
 */
router.get(
  '/accounts',
  authenticate(),
  ensurePermission('user', 'read'),
  [
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(User, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for user accounts ${limit}`);
    return {
      include: [
        {
          model: UserProfile,
          required: true
        }
      ],
      limit,
      offset
    };
  })
);

/**
 * GET Role Users
 * @param roleid int
 */
router.get(
  '/role/:roleId(\\d+)',
  authenticate(),
  ensurePermission('user', 'read'),
  [
    param('roleId').isNumeric().toInt(),
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt()
  ],
  handleValidationErrors(),
  handleFindAll(UsersRoles, (req) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;
    const { roleId } = req.params;

    log.info(`request for all users with role id ${roleId}`);
    return {
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
          required: true,
          include: [
            {
              model: UserProfile,
              required: true
            }
          ]
        }
      ],
      limit,
      offset
    };
  })
);

/**
 * GET User Stats
 */
router.get(
  '/count',
  authenticate(),
  ensurePermission('user', 'read'),
  handleCount(User)
);

export default router;
