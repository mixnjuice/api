import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleFindAll,
  handleValidationErrors,
  handleModelOperation
} from 'modules/utils/request';

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
  handleModelOperation(Vendor, 'findOne', req => {
    const { id } = req.params;

    log.info(`request for vendor ${req.params.id}`);
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
  handleModelOperation(Vendor, 'create', req => {
    const { name, slug, code } = req.body;

    log.info(`request for new vendor`);
    return [
      {
        name,
        slug,
        code
      }
    ];
  })
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
  handleModelOperation(Vendor, 'update', req => {
    const { id, name, slug, code } = req.params;

    return [
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
    ];
  })
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
  handleModelOperation(Vendor, 'destroy', req => ({
    where: {
      id: req.params.id
    }
  }))
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
  handleFindAll(VendorIdentifier, req => {
    const { vendorId } = req.params;

    log.info(`request for vendor id ${vendorId} identifiers`);

    return {
      where: {
        vendorId
      },
      include: [
        {
          model: DataSupplier,
          require: true
        }
      ]
    };
  })
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
  handleModelOperation(VendorIdentifier, 'findOne', req => {
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request for vendor id ${vendorId} data supplier id ${dataSupplierId} identifer`
    );
    return [
      {
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
      }
    ];
  })
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
  handleModelOperation(VendorIdentifier, 'create', req => {
    const { vendorId } = req.params;
    const { dataSupplierId, identifier } = req.body;

    log.info(`request for new vendor identifier for vendor id ${vendorId}`);
    return [
      {
        vendorId,
        dataSupplierId,
        identifier
      }
    ];
  })
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
  handleModelOperation(VendorIdentifier, 'update', req => {
    const { identifier } = req.body;
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request to update vendor id ${vendorId} identifier id ${dataSupplierId}`
    );
    return [
      {
        identifier
      },
      {
        where: {
          vendorId,
          dataSupplierId
        }
      }
    ];
  })
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
  handleModelOperation(VendorIdentifier, 'destroy', req => {
    const { vendorId, dataSupplierId } = req.params;

    log.info(
      `request to delete vendor id ${vendorId} identifier id ${dataSupplierId}`
    );
    return [
      {
        where: {
          vendorId,
          dataSupplierId
        }
      }
    ];
  })
);

export default router;
