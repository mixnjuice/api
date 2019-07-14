import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('user');
const { Flavor, Recipe, User, UserFlavors, UserProfile, Vendor } = models;

/**
 * GET User Info
 * @param id int
 */
router.get(
  '/:id(d+)',
  [
    check('id')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.id}`);
    try {
      const result = await User.findOne({
        where: {
          id: req.params.id
        }
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/* POST /:id - Update user info. Haven't decided if we should split updating email and password into separate routes
router.put(
  '/:id(\d+)',
  [
    check('id')
      .isNumeric()
      .toInt(),
    check('email')
      .isEmail()
      .normalizeEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update request ${req.params.id}`);
    try {
      const result = await User.update(req.body, {
        where: {
          id: req.params.id
        }
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
*/
/**
 * GET User Profile
 * @param name string
 */
router.get(
  '/:name',
  [
    check('name')
      .isAlphanumeric()
      .escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.name}`);
    try {
      const result = await UserProfile.findOne({
        where: {
          name: req.params.name
        }
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * GET User Recipes
 * @param id int
 */
router.get(
  '/:id/recipes',
  [
    check('id')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.id}`);
    try {
      const result = await Recipe.findAll({
        where: {
          userId: req.params.id
        }
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

/**
 * GET User Flavors
 * @param id int
 */
router.get(
  '/:id/flavors',
  [
    check('id')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.name}`);
    try {
      const result = await UserFlavors.findAll({
        where: {
          userId: req.params.id
        },
        include: [
          {
            model: Flavor,
            required: true
          },
          {
            model: Vendor,
            required: true
          }
        ]
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * POST Add Flavor to User's Flavor Stash
 * @param id int - User ID
 */
router.post(
  '/:id/flavor',
  [
    check('id')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for ${req.params.id}`);
    try {
      const result = await UserFlavors.create({
        userId: req.body.id,
        flavorId: req.body.flavorId,
        created: req.body.created,
        minMillipercent: req.body.minMillipercent,
        maxMillipercent: req.body.maxMillipercent
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * PUT Update User's Flavor Stash Entry
 */
router.put(
  '/:userid/flavor/:flavorid',
  [
    check('userid')
      .isNumeric()
      .toInt(),
    check('flavorrid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update for ${req.params.flavorid}`);
    try {
      const result = await UserFlavors.update({
        minMillipercent: req.body.minMillipercent,
        maxMillipercent: req.body.maxMillipercent,
        where: {
          userId: req.params.userid,
          flavorId: req.params.flavorid
        }
      });

      if (result[0].length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
