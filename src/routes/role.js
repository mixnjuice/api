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
 * @param roleid int
 */
router.get(
  '/:roleid(\\d+)',
  authenticate(),
  [
    param('roleid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for role id ${req.params.roleid}`);
    try {
      const result = await Role.findOne({
        where: {
          id: req.params.roleid
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
 * @param roleid int
 */
router.put(
  '/:roleid(\\d+)',
  authenticate(),
  [
    param('roleid')
      .isNumeric()
      .toInt(),
    body('name').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update role id ${req.params.roleid}`);
    try {
      const result = await Role.update(
        {
          name: req.body.name
        },
        {
          where: {
            id: req.params.roleid
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
 */
router.delete(
  '/:roleid(\\d+)',
  authenticate(),
  [
    param('roleid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`delete role id ${req.params.roleid}`);
    try {
      const result = await Role.destroy({
        where: {
          id: req.params.roleid
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
