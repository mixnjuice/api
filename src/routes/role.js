import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
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
  '/:roleId(\\d+)',
  authenticate(),
  [
    param('roleId')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for role id ${req.params.roleId}`);
    try {
      const result = await Role.findOne({
        where: {
          id: req.params.roleId
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
  '/:roleId(\\d+)',
  authenticate(),
  [
    param('roleId')
      .isNumeric()
      .toInt(),
    body('name').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update role id ${req.params.roleId}`);
    try {
      const result = await Role.update(
        {
          name: req.body.name
        },
        {
          where: {
            id: req.params.roleId
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
  [body('name').isString()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`create new role`);
    try {
      const result = await Role.create({
        name: req.body.name
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
  '/:roleId(\\d+)',
  authenticate(),
  [
    param('roleId')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`delete role id ${req.params.roleId}`);
    try {
      const result = await Role.destroy({
        where: {
          id: req.params.roleId
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
