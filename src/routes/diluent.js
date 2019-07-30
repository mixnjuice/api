import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

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

    log.info(`request for diluent id ${req.params.id}`);
    try {
      const result = await Diluent.findOne({
        where: {
          id: req.params.id
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
 * POST Create a Diluent
 */
router.post(
  '/',
  authenticate(),
  [
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug').isString(),
    body('code').isString(),
    body('density').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for new diluent`);
    try {
      const result = await Diluent.create({
        name: req.body.name,
        slug: req.body.slug,
        code: req.body.code,
        density: req.body.density
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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request to update diluent ${req.params.id}`);
    try {
      const result = await Diluent.update(
        {
          name: req.body.name,
          slug: req.body.slug,
          code: req.body.code,
          density: req.body.density
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
 * Delete Diluent
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

    log.info(`request to delete diluent id ${req.params.id}`);
    try {
      const result = await Diluent.destroy({
        where: {
          id: req.params.id
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
