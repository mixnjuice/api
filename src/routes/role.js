import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleValidationErrors,
  handleModelOperation
} from 'modules/utils/request';

const router = Router();
const log = loggers('role');
const { Role } = models;

/**
 * GET Role Info
 * @param roleId int
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
  handleValidationErrors(),
  handleModelOperation(Role, 'findOne', req => ({
    where: {
      id: req.params.id
    }
  }))
);
/**
 * PUT Update Role
 * @param roleId int
 * @body name string
 */
router.put(
  '/:id(\\d+)',
  authenticate(),
  ensurePermission('role', 'update'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name').isString()
  ],
  handleValidationErrors(),
  handleModelOperation(Role, 'update', req => {
    const { id } = req.params;
    const { name } = req.body;

    log.info(`update role id ${id}`);
    return [
      {
        name
      },
      {
        where: {
          id
        }
      }
    ];
  })
);

/**
 * POST Add Role
 * @body name str
 */
router.post(
  '/',
  authenticate(),
  ensurePermission('role', 'create'),
  [body('name').isString()],
  handleValidationErrors(),
  handleModelOperation(Role, 'create', req => [
    {
      name: req.body.name
    }
  ])
);
/**
 * DELETE Role
 * @param roleId int
 */
router.delete(
  '/:id(\\d+)',
  authenticate(),
  ensurePermission('role', 'delete'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(Role, 'destroy', req => [
    {
      where: {
        id: req.params.id
      }
    }
  ])
);

export default router;
