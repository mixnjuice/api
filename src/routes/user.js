import { Router } from 'express';
import { param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('user');
const { Flavor, Recipe, User, UsersFlavors, UserProfile, Vendor } = models;

/**
 * GET User Info
 * @param userid int
 */
router.get(
  '/:userid',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for user ${req.params.userid}`);
    try {
      const result = await User.findOne({
        where: {
          id: req.params.userid
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
/* PUT /:userid - Update user info. - still trying to figure out the best approach here
 */

/**
 * GET User Profile
 * @param userid int
 */
router.get(
  '/:userid/profile',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for user profile ${req.params.userid}`);
    try {
      const result = await UserProfile.findOne({
        where: {
          userId: req.params.userid
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
 * PUT Update User's Profile
 * @param userid int
 */
router.put(
  '/:userid/profile',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update user profile ${req.params.userid}`);
    try {
      const result = await UserProfile.update(
        {
          location: req.body.location,
          bio: req.body.bio,
          url: req.body.url
        },
        {
          where: {
            userId: req.params.userid
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
 * GET User Recipes
 * @param userid int
 */
router.get(
  '/:userid/recipes',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for user recipes ${req.params.userid}`);
    try {
      const result = await Recipe.findAll({
        where: {
          userId: req.params.userid
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
 * GET User Flavors
 * @param userid int
 */
router.get(
  '/:userid/flavors',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request flavor stash for user ${req.params.userid}`);
    try {
      const result = await UsersFlavors.findAll({
        where: {
          userId: req.params.userid
        },
        include: [
          {
            model: Flavor,
            required: true,
            include: [
              {
                model: Vendor,
                required: true
              }
            ]
          }
        ]
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
 * POST Add Flavor to User's Flavor Stash
 * @param userid int - User ID
 */
router.post(
  '/:userid/flavor',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`create flavor stash for user ${req.params.id}`);
    try {
      const result = await UsersFlavors.create({
        userId: req.params.userid,
        flavorId: req.body.flavorId,
        created: req.body.created,
        minMillipercent: req.body.minMillipercent,
        maxMillipercent: req.body.maxMillipercent
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
 * PUT Update User's Flavor Stash Entry
 */
router.put(
  '/:userid/flavor/:flavorid',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt(),
    param('flavorid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update user ${req.params.userid} flavor ${req.params.flavorid}`);
    try {
      const result = await UsersFlavors.update(
        {
          minMillipercent: req.body.minMillipercent,
          maxMillipercent: req.body.maxMillipercent
        },
        {
          where: {
            userId: req.params.userid,
            flavorId: req.params.flavorid
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
 * DELETE Remove User's Flavor Stash Entry
 */
router.delete(
  '/:userid/flavor/:flavorid',
  authenticate(),
  [
    param('userid')
      .isNumeric()
      .toInt(),
    param('flavorid')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`delete from flavor stash for ${req.params.flavorid}`);
    try {
      const result = await UsersFlavors.destroy({
        where: {
          userId: req.params.userid,
          flavorId: req.params.flavorid
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
