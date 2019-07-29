import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('flavor');
const { DataSupplier, Flavor, FlavorIdentifier, Vendor } = models;

/**
 * GET Flavor by ID
 * @param id int
 */
router.get(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.id}`);
    try {
      const result = await Flavor.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Vendor,
            require: true
          }
        ]
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
 * GET Flavor Data Supplier Identifiers
 * @param id int
 */
router.get(
  '/:id/identifiers',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for flavor id ${req.params.id} identifiers`);
    try {
      const result = await FlavorIdentifier.findAll({
        where: {
          flavorId: req.params.id
        },
        include: [
          {
            model: DataSupplier,
            require: true
          }
        ]
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
 * GET Flavor Data Supplier Identifier
 * @param flavorId int
 * @param dataSupplierId int
 */
router.get(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(
      `request for flavor id ${req.params.flavorId} data supplier id ${req.params.dataSupplierId} identifer`
    );
    try {
      const result = await FlavorIdentifier.findOne({
        where: {
          flavorId: req.params.flavorId,
          dataSupplierId: req.params.dataSupplierId
        },
        include: [
          {
            model: DataSupplier,
            require: true
          }
        ]
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
 * POST Create a Flavor Identifier
 * @param id int
 * @param dataSupplierId int
 * @body identifier string
 */
router.post(
  '/:id/identifier',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('identifier')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(
      `request for new flavor identifier for flavor id ${req.params.id}`
    );
    try {
      const result = await FlavorIdentifier.create({
        flavorId: req.params.id,
        dataSupplierId: req.body.dataSupplierId,
        identifier: req.body.identifier
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
 * PUT Update a Flavor Identifier
 * @param flavorId int
 * @param dataSupplierId int
 * @body identifier string
 */
router.put(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('identifier')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(
      `request to update flavor id ${req.params.flavorId} identifier id ${req.params.dataSupplierId}`
    );
    try {
      const result = await FlavorIdentifier.update(
        {
          identifier: req.body.identifier
        },
        {
          where: {
            flavorId: req.params.flavorId,
            dataSupplierId: req.params.dataSupplierId
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
 * Delete Diluent
 * @param flavorId int
 * @param dataSupplierId int
 */
router.delete(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(
      `request to delete flavor id ${req.params.flavorId} identifier id ${req.params.dataSupplierId}`
    );
    try {
      const result = await FlavorIdentifier.destroy({
        where: {
          flavorId: req.params.flavorId,
          dataSupplierId: req.params.dataSupplierId
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

export default router;
