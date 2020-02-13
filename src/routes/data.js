import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { authenticate, ensureRole } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  countAll,
  fetchAll,
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
  async (req, res) => {
    const { id } = req.params;

    log.info(`request for data supplier id ${id}`);
    try {
      const result = await DataSupplier.findOne({
        where: {
          id
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
  async (req, res) => {
    log.info(`request for new data supplier`);
    try {
      const { name, code } = req.body;
      const result = await DataSupplier.create({
        name,
        code
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
  async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    log.info(`request to update data supplier id ${id}`);
    try {
      const result = await DataSupplier.update(
        {
          name,
          code
        },
        {
          where: {
            id
          }
        }
      );

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
  async (req, res) => {
    const { id } = req.params;

    log.info(`request to delete data supplier id ${id}`);
    try {
      const result = await DataSupplier.destroy({
        where: {
          id
        }
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
/**
 * GET Suppliers Stats
 */
router.get('/suppliers/count', authenticate(), countAll(DataSupplier));
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
  req => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for data suppliers`);
    return fetchAll(DataSupplier, { limit, offset });
  }
);
/**
 * GET Database Schema Version Info
 */
router.get('/version', authenticate(), ensureRole('Administrator'), () => {
  log.info(`request for Schema Version`);
  return fetchAll(SchemaVersion);
});

export default router;
