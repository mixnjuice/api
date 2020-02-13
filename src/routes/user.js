import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import { fetchAll, handleValidationErrors } from 'modules/utils/request';

const router = Router();
const log = loggers('user');
const {
  Flavor,
  Recipe,
  Role,
  User,
  UsersFlavors,
  UserProfile,
  UsersRoles,
  Vendor
} = models;

/**
 * GET User Info
 * @param userId int
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
  handleValidationErrors(),
  async (req, res) => {
    const { id } = req.params;

    log.info(`request for user ${id}`);
    try {
      const result = await User.findOne({
        where: {
          id
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
  }
);
/* PUT /:userId - Update user info. - still trying to figure out the best approach here
 */

/**
 * GET User Profile
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/profile',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId } = req.params;

    log.info(`request for user profile ${userId}`);
    try {
      const result = await UserProfile.findOne({
        where: {
          userId
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
  }
);
/**
 * PUT Update User's Profile
 * @param userId int
 */
router.put(
  '/:userId(\\d+)/profile',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId } = req.params;
    const { location, bio, url } = req.body;

    log.info(`update user profile ${userId}`);
    try {
      const result = await UserProfile.update(
        {
          location,
          bio,
          url
        },
        {
          where: {
            userId
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
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/recipes',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const { userId } = req.params;

    log.info(`request for user recipes ${userId}`);
    return fetchAll(Recipe, {
      where: {
        userId
      }
    });
  }
);

/**
 * GET User Flavors
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/flavors',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const { userId } = req.params;

    log.info(`request flavor stash for user ${userId}`);
    return fetchAll(UsersFlavors, {
      where: {
        userId
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
  }
);
/**
 * GET A User Flavor
 * @param userId int
 * @param flavorId int
 */
router.get(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const { userId, flavorId } = req.params;

    log.info(
      `request flavor stash flavor id ${req.params.userId} for user ${req.params.userId}`
    );

    return fetchAll(UsersFlavors, {
      where: {
        userId,
        flavorId
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
  }
);
/**
 * POST Add Flavor to User's Flavor Stash
 * @param userId int - User ID
 */
router.post(
  '/:userId(\\d+)/flavor',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId } = req.params;
    const { flavorId, created, minMillipercent, maxMillipercent } = req.body;

    log.info(`create flavor stash for user ${userId}`);
    try {
      const result = await UsersFlavors.create({
        userId,
        flavorId,
        created,
        minMillipercent,
        maxMillipercent
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
 * @param userId int
 * @param flavorId int
 */
router.put(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { minMillipercent, maxMillipercent } = req.body;
    const { userId, flavorId } = req.params;

    log.info(`update user ${userId} flavor ${flavorId}`);
    try {
      const result = await UsersFlavors.update(
        {
          minMillipercent,
          maxMillipercent
        },
        {
          where: {
            userId,
            flavorId
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
 * @param userId int
 * @param flavorId int
 */
router.delete(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId, flavorId } = req.params;

    log.info(`delete from flavor stash for ${flavorId}`);
    try {
      const result = await UsersFlavors.destroy({
        where: {
          userId,
          flavorId
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
 * GET User Roles
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/roles',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  req => {
    const { userId } = req.params;

    log.info(`request roles for user ${userId}`);
    return fetchAll(UsersRoles, {
      where: {
        userId
      },
      include: [
        {
          model: Role,
          required: true
        }
      ]
    });
  }
);
/**
 * GET A User Role
 * @param userId int
 * @param roleId int
 */
router.get(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId, roleId } = req.params;

    log.info(`request role id ${roleId} for user ${userId}`);
    try {
      const result = await UsersRoles.findOne({
        where: {
          userId,
          roleId
        },
        include: [
          {
            model: Role,
            required: true
          }
        ]
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
  }
);
/**
 * POST Add Role to User's Roles
 * @param userId int - User ID
 * @body roleId int
 * @body active boolean
 */
router.post(
  '/:userId(\\d+)/role',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('active').isBoolean()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId } = req.params;
    const { roleId, active } = req.body;

    log.info(`add role to user ${userId}`);
    try {
      const result = await UsersRoles.create({
        userId,
        roleId,
        active: active || true
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
 * PUT Update User's Role
 * @param userId int
 * @param roleId int
 * @body active boolean
 */
router.put(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('active').isBoolean()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId, roleId } = req.params;
    const { active } = req.body;

    log.info(`update user ${userId} role ${roleId}`);
    try {
      const result = await UsersRoles.update(
        {
          active
        },
        {
          where: {
            userId,
            roleId
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
 * DELETE Remove User's Role
 * @param userId int
 * @param roleId int
 */
router.delete(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  async (req, res) => {
    const { userId, roleId } = req.params;

    log.info(`delete from role ${roleId} from user ${userId}`);
    try {
      const result = await UsersRoles.destroy({
        where: {
          userId,
          roleId
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

router.get('/current', authenticate(), async (req, res) => {
  try {
    res.type('application/json');
    res.json(req.user);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * GET User Info by Username
 * @param userName string
 */
router.get(
  '/:name',
  authenticate(),
  [param('name').isString()],
  handleValidationErrors(),
  async (req, res) => {
    const { name } = req.params;

    log.info(`request for username ${name}`);
    try {
      const result = await UserProfile.findOne({
        where: {
          name
        },
        include: [
          {
            model: User,
            required: true
          }
        ]
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
  }
);

export default router;
