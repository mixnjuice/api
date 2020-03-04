import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleFindAll,
  handleValidationErrors,
  handleModelOperation
} from 'modules/utils/request';

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
  ensurePermission('flavor', 'read'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(Flavor, 'findOne', req => {
    const { id } = req.params;

    log.info(`request for ${id}`);
    return [
      {
        where: {
          id
        },
        include: [
          {
            model: Vendor,
            require: true
          }
        ]
      }
    ];
  })
);

/**
 * POST Create a Flavor
 * @body vendorId int
 * @body name string
 * @body slug string
 * @body density decimal
 */
router.post(
  '/',
  authenticate(),
  ensurePermission('flavor', 'create'),
  [
    body('vendorId')
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
    body('density').isDecimal()
  ],
  handleValidationErrors(),
  handleModelOperation(Flavor, 'create', req => {
    const { vendorId, name, slug, density } = req.body;

    log.info(`request for new flavor`);
    return [
      {
        vendorId,
        name,
        slug,
        density
      }
    ];
  })
);

/**
 * PUT Updates a Flavor
 * @param id int
 * @body vendorId int
 * @body name string
 * @body slug string
 * @body density decimal
 */
router.put(
  '/:id',
  authenticate(),
  ensurePermission('flavor', 'update'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('vendorId')
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
    body('density').isDecimal()
  ],
  handleValidationErrors(),
  handleModelOperation(Flavor, 'update', req => {
    const { id } = req.params;
    const { vendorId, name, slug, density } = req.body;

    log.info(`request to update flavor id ${id}`);
    return [
      {
        vendorId,
        name,
        slug,
        density
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
 * DELETE Deletes a Flavor
 * @param id int
 */
router.delete(
  '/:id',
  authenticate(),
  ensurePermission('flavor', 'delete'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(Flavor, 'destroy', req => {
    const { id } = req.params;

    log.info(`request to delete flavor id ${id}`);
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
 * GET Flavor Data Supplier Identifiers
 * @param id int
 */
router.get(
  '/:flavorId/identifiers',
  authenticate(),
  ensurePermission('flavor', 'read'),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleFindAll(FlavorIdentifier, req => {
    const { flavorId } = req.params;

    log.info(`request for flavor id ${flavorId} identifiers`);
    return {
      where: {
        flavorId
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
 * GET Flavor Data Supplier Identifier
 * @param flavorId int
 * @param dataSupplierId int
 */
router.get(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  ensurePermission('flavor', 'read'),
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
  handleValidationErrors(),
  handleModelOperation(FlavorIdentifier, 'findOne', req => {
    const { flavorId, dataSupplierId } = req.params;

    log.info(
      `request for flavor id ${flavorId} data supplier id ${dataSupplierId} identifer`
    );
    return [
      {
        where: {
          flavorId,
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
 * POST Create a Flavor Identifier
 * @param id int
 * @param dataSupplierId int
 * @body identifier string
 */
router.post(
  '/:flavorId/identifier',
  authenticate(),
  ensurePermission('flavor', 'create'),
  [
    param('flavorId')
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
  handleModelOperation(FlavorIdentifier, 'create', req => {
    const { flavorId } = req.params;
    const { dataSupplierId, identifier } = req.body;

    log.info(`request for new flavor identifier for flavor id ${flavorId}`);
    return [
      {
        flavorId,
        dataSupplierId,
        identifier
      }
    ];
  })
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
  ensurePermission('flavor', 'update'),
  ensurePermission('flavor', 'manage'),
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
  handleValidationErrors(),
  handleModelOperation(FlavorIdentifier, 'update', req => {
    const { flavorId, dataSupplierId } = req.params;
    const { identifier } = req.body;

    log.info(
      `request to update flavor id ${flavorId} identifier id ${dataSupplierId}`
    );
    return [
      {
        identifier
      },
      {
        where: {
          flavorId,
          dataSupplierId
        }
      }
    ];
  })
);
/**
 * Delete Flavor Identifier
 * @param flavorId int
 * @param dataSupplierId int
 */
router.delete(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  ensurePermission('flavor', 'delete'),
  ensurePermission('flavor', 'manage'),
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
  handleValidationErrors(),
  handleModelOperation(FlavorIdentifier, 'destroy', req => {
    const { flavorId, dataSupplierId } = req.params;

    log.info(
      `request to delete flavor id ${flavorId} identifier id ${dataSupplierId}`
    );
    return [
      {
        where: {
          flavorId,
          dataSupplierId
        }
      }
    ];
  })
);

export default router;
