import { Router } from 'express';
import { authenticate, ensureRole } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('roles');
const {
  Flavor,
  Recipe,
  Tag,
  TagsFlavors,
  TagsRecipes,
  User,
  UserToken,
  Vendor
} = models;

/**
 * GET Roles
 */
router.get(
  '/dashboard',
  authenticate(),
  ensureRole('Administrator'),
  async (req, res) => {
    log.info(`request for dashboard stats`);
    try {
      // User Stats
      const users = await User.count();

      const activatedUsers = await User.count({
        where: { activationCode: null }
      });

      const userTokens = await UserToken.count();
      // Vendor Stats
      const vendors = await Vendor.count();
      // Flavor Stats
      const flavors = await Flavor.count();
      // Flavor Tags Stats
      const flavorTags = await TagsFlavors.count();
      // Recipe Stats
      const recipes = await Recipe.count();
      // Recipe Tags Stats
      const recipeTags = await TagsRecipes.count();
      // Tags Stats
      const tags = await Tag.count();
      // Results
      const result = {
        activatedUsers,
        flavors,
        flavorTags,
        recipes,
        recipeTags,
        tags,
        users,
        userTokens,
        vendors
      };

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
