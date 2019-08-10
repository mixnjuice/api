import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate, ensureRole } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`request for role id ${id}`);
    try {
      const result = await Role.findOne({
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
 * PUT Update Role
 * @param roleId int
 * @body name string
 */
router.put(
  '/:id(\\d+)',
  authenticate(),
  ensureRole('Administrator'),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { name } = req.body;

    log.info(`update role id ${id}`);
    try {
      const result = await Role.update(
        {
          name
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
 * POST Add Role
 * @body name str
 */
router.post(
  '/',
  authenticate(),
  ensureRole('Administrator'),
  [body('name').isString()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;

    log.info(`create new role`);
    try {
      const result = await Role.create({
        name
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
 * DELETE Role
 * @param roleId int
 */
router.delete(
  '/:id(\\d+)',
  authenticate(),
  ensureRole('Administrator'),
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
    const { id } = req.params;

    log.info(`delete role id ${id}`);
    try {
      const result = await Role.destroy({
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

export default router;
