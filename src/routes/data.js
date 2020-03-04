import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleCount,
  handleFindAll,
  handleModelOperation,
  handleValidationErrors
} from 'modules/utils/request';

const router = Router();
const log = loggers('data');
const { DataSupplier, SchemaVersion } = models;

/**
 * GET a Data Supplier
 * @param id int
 */
router.get(
  '/supplier/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(DataSupplier, 'findOne', req => {
    const { id } = req.params;

    log.info(`request for data supplier id ${id}`);
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
 * POST Create a Data Supplier
 * @body name string
 * @body code string
 */
router.post(
  '/supplier',
  authenticate(),
  [
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('code').isString()
  ],
  handleValidationErrors(),
  handleModelOperation(DataSupplier, 'create', req => {
    const { name, code } = req.body;

    log.info(`request for new data supplier`);
    return [{ name, code }];
  })
);
/**
 * PUT Update a Data Supplier
 * @param id int
 * @body name string
 * @body slug string
 * @body code string
 * @body density numeric
 */
router.put(
  '/supplier/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('code').isString()
  ],
  handleValidationErrors(),
  handleModelOperation(DataSupplier, 'update', req => {
    const { id } = req.params;
    const { name, code } = req.body;

    log.info(`request to update data supplier id ${id}`);
    return [
      {
        name,
        code
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
 * Delete a Data Supplier
 * @param id int
 */
router.delete(
  '/supplier/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(DataSupplier, 'destroy', req => {
    const { id } = req.params;

    log.info(`request to delete data supplier id ${id}`);
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
 * GET Suppliers Stats
 */
router.get('/suppliers/count', authenticate(), handleCount(DataSupplier));
/**
 * GET Data Suppliers
 */
router.get(
  '/suppliers',
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
  handleFindAll(DataSupplier, req => ({
    limit: req.query.limit || 20,
    offset: req.query.offset - 1 || 0
  }))
);

/**
 * GET Database Schema Version Info
 */
router.get(
  '/version',
  authenticate(),
  ensurePermission('data', 'read'),
  handleFindAll(SchemaVersion)
);

export default router;
