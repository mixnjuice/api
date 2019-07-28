/**
 * *** NOT A PRODUCTION ROUTE ***
 * Mock route to be used to inject data during tests, discard data after tests
 */
import { Router } from 'express';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('mock daddy');
const { User, UserProfile } = models;
const date = new Date();

/**
 * POST Create a Test User
 */
router.post('/mock/user', authenticate(), async (req, res) => {
  log.info(`create new test user`);
  try {
    const result = await User.create({
      emailAddress: 'example' + date.getTime() + '@example.com',
      password: date.getTime(),
      created: date,
      activationCode: null
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
});
/**
 * DELETE Delete a Test User
 * @param id int
 */
router.delete('/mock/user/:id', authenticate(), async (req, res) => {
  log.info(`delete test user`);
  try {
    const result = await User.destroy({
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
});
/**
 * POST Create a Test User Profile
 */
router.post('/mock/user/:id/profile', authenticate(), async (req, res) => {
  log.info(`create new test user profile`);
  try {
    const result = await UserProfile.create({
      userId: req.params.id,
      name: 'mock' + date.getTime()
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
});
/**
 * DELETE Delete a Test User Profile
 * @param id int
 */
router.delete('/mock/user/:id/profile', authenticate(), async (req, res) => {
  log.info(`delete test user profile`);
  try {
    const result = await UserProfile.destroy({
      where: {
        userId: req.params.id
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
});

export default router;
