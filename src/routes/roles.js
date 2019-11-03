import { Router } from 'express';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('roles');
const { Role } = models;

/**
 * GET Roles
 */
router.get('/', authenticate(), async (req, res) => {
  log.info(`request for roles`);
  try {
    const result = await Role.findAll();

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(204).end();
    }

    res.type('application/json');
    res.json(result);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * GET Roles Stats
 */
router.get('/count', authenticate(), async (req, res) => {
  log.info(`request for roles stats`);
  try {
    // Roles Stats
    const result = await Role.count();

    res.type('application/json');
    res.json(result);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

export default router;
