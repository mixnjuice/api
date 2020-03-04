import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleModelOperation,
  handleValidationErrors
} from 'modules/utils/request';

const router = Router();
const log = loggers('diluent');
const { Diluent } = models;

/**
 * GET Diluent
 * @param id int
 */
router.get(
  '/:id',
  authenticate(),
  ensurePermission('diluent', 'read'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(Diluent, 'findOne', req => {
    const { id } = req.params;

    log.info(`request for diluent id ${id}`);
    return [
      {
        where: {
          id
        }
      }
    ];
  })
);

/**
 * POST Create a Diluent
 */
router.post(
  '/',
  authenticate(),
  ensurePermission('diluent', 'create'),
  [
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug').isString(),
    body('code').isString(),
    body('density').isNumeric()
  ],
  handleValidationErrors(),
  handleModelOperation(Diluent, 'create', req => {
    const { name, slug, code, density } = req.body;

    log.info(`request for new diluent`);
    return [
      {
        name,
        slug,
        code,
        density
      }
    ];
  })
);

/**
 * PUT Update a Diluent
 * @param id int
 * @body name string
 * @body slug string
 * @body code string
 * @body density numeric
 */
router.put(
  '/:id',
  authenticate(),
  ensurePermission('diluent', 'update'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug').isString(),
    body('code').isString(),
    body('density').isDecimal()
  ],
  handleValidationErrors(),
  handleModelOperation(Diluent, 'update', req => {
    const { id } = req.params;
    const { name, slug, code, density } = req.body;

    log.info(`request to update diluent ${id}`);
    return [
      {
        name,
        slug,
        code,
        density
      },
      {
        where: {
          id: req.params.id
        }
      }
    ];
  })
);

/**
 * Delete Diluent
 * @param id int
 */
router.delete(
  '/:id',
  authenticate(),
  ensurePermission('diluent', 'delete'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(Diluent, 'destroy', req => {
    const { id } = req.params;

    log.info(`request to delete diluent id ${id}`);
    return [
      {
        where: {
          id
        }
      }
    ];
  })
);
export default router;
