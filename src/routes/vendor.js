import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import { fetchAll, handleValidationErrors } from 'modules/utils/request';

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
  handleValidationErrors(),
  async (req, res) => {
    const { id } = req.params;

    log.info(`request for vendor ${req.params.id}`);
    try {
      const result = await Vendor.findOne({
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
  handleValidationErrors(),
  async (req, res) => {
    log.info(`request for new vendor`);
    try {
      const { name, slug, code } = req.body;
      const result = await Vendor.create({
        name,
        slug,
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
  handleValidationErrors(),
  async (req, res) => {
    const { id } = req.params;
    const { name, slug, code } = req.body;

    log.info(`request to update vendor id ${id}`);
    try {
      const result = await Vendor.update(
        {
          name,
          slug,
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
  handleValidationErrors(),
  async (req, res) => {
    const { id } = req.params;

    log.info(`request to delete vendor id ${id}`);
    try {
      const result = await Vendor.destroy({
        where: {
          id
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
  '/:vendorId/identifiers',
  authenticate(),
  [
    param('vendorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const { vendorId } = req.params;

    log.info(`request for vendor id ${vendorId} identifiers`);
    return fetchAll(VendorIdentifier, {
      where: {
        vendorId
      },
      include: [
        {
          model: DataSupplier,
          require: true
        }
      ]
    });
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
  handleValidationErrors(),
  async (req, res) => {
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request for vendor id ${vendorId} data supplier id ${dataSupplierId} identifer`
    );
    try {
      const result = await VendorIdentifier.findOne({
        where: {
          vendorId,
          dataSupplierId
        },
        include: [
          {
            model: DataSupplier,
            require: true
          }
        ]
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
 * POST Create a Vendor Identifier
 * @param id int
 * @param dataSupplierId int
 * @body identifier string
 */
router.post(
  '/:vendorId/identifier',
  authenticate(),
  [
    param('vendorId')
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
  handleValidationErrors(),
  async (req, res) => {
    const { vendorId } = req.params;
    const { dataSupplierId, identifier } = req.body;

    log.info(`request for new vendor identifier for vendor id ${vendorId}`);
    try {
      const result = await VendorIdentifier.create({
        vendorId,
        dataSupplierId,
        identifier
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
  handleValidationErrors(),
  async (req, res) => {
    const { identifier } = req.body;
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request to update vendor id ${vendorId} identifier id ${dataSupplierId}`
    );
    try {
      const result = await VendorIdentifier.update(
        {
          identifier
        },
        {
          where: {
            vendorId,
            dataSupplierId
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
  handleValidationErrors(),
  async (req, res) => {
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request to delete vendor id ${vendorId} identifier id ${dataSupplierId}`
    );
    try {
      const result = await VendorIdentifier.destroy({
        where: {
          vendorId,
          dataSupplierId
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
