import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('vendor');
const { DataSupplier, Vendor, VendorIdentifier } = models;

/**
 * GET Vendor
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

    log.info(`request for vendor ${req.params.id}`);
    try {
      const result = await Vendor.findOne({
        where: {
          id: req.params.id
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
 * POST Create a Vendor
 * @body name string
 * @body slug string
 * @body code string
 */
router.post(
  '/',
  authenticate(),
  [
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('code')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for new vendor`);
    try {
      const result = await Vendor.create({
        name: req.body.name,
        slug: req.body.slug,
        code: req.body.code
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
 * PUT Updates a Vendor
 * @param id int
 * @body vendorId int
 * @body name string
 * @body slug string
 * @body code string
 */
router.put(
  '/:id',
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
    body('slug')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('code')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request to update vendor id ${req.params.id}`);
    try {
      const result = await Vendor.update(
        {
          name: req.body.name,
          slug: req.body.slug,
          code: req.body.code
        },
        {
          where: {
            id: req.params.id
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
 * DELETE Deletes a Vendor
 * @param id int
 */
router.delete(
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

    log.info(`request to delete vendor id ${req.params.id}`);
    try {
      const result = await Vendor.destroy({
        where: {
          id: req.params.id
        }
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
 * GET Vendor Data Supplier Identifiers
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

    log.info(`request for vendor id ${req.params.id} identifiers`);
    try {
      const result = await VendorIdentifier.findAll({
        where: {
          vendorId: req.params.id
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
 * GET Vendor Data Supplier Identifier
 * @param vendorId int
 * @param dataSupplierId int
 */
router.get(
  '/:vendorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('vendorId')
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
      `request for vendor id ${req.params.vendorId} data supplier id ${req.params.dataSupplierId} identifer`
    );
    try {
      const result = await VendorIdentifier.findOne({
        where: {
          vendorId: req.params.vendorId,
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
 * POST Create a Vendor Identifier
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
      `request for new vendor identifier for vendor id ${req.params.id}`
    );
    try {
      const result = await VendorIdentifier.create({
        vendorId: req.params.id,
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
 * PUT Update a Vendor Identifier
 * @param vendorId int
 * @param dataSupplierId int
 * @body identifier string
 */
router.put(
  '/:vendorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('vendorId')
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
      `request to update vendor id ${req.params.vendorId} identifier id ${req.params.dataSupplierId}`
    );
    try {
      const result = await VendorIdentifier.update(
        {
          identifier: req.body.identifier
        },
        {
          where: {
            vendorId: req.params.vendorId,
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
 * @param vendorId int
 * @param dataSupplierId int
 */
router.delete(
  '/:vendorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('vendorId')
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
      `request to delete vendor id ${req.params.vendorId} identifier id ${req.params.dataSupplierId}`
    );
    try {
      const result = await VendorIdentifier.destroy({
        where: {
          vendorId: req.params.vendorId,
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
