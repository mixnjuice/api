import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('recipe');
const {
  Diluent,
  Flavor,
  Recipe,
  UserProfile,
  RecipesFlavors,
  RecipesDiluents
} = models;

/**
 * GET Recipe
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
    const { id } = req.params;

    log.info(`request for ${id}`);
    try {
      // Get the recipe, with associations
      const result = await Recipe.findOne({
        where: {
          id
        },
        include: [
          {
            model: UserProfile,
            required: true
          },
          {
            model: Flavor,
            as: 'Flavors'
          },
          {
            model: Diluent,
            as: 'Diluents'
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
 * POST Create a Recipe and associations
 * @body userId int
 * @body name string
 * @body notes string
 * @body RecipesFlavors array
 * @body RecipesDiluents array
 */
router.post(
  '/',
  authenticate(),
  [
    body('userId')
      .isNumeric()
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('notes').isString(),
    body('RecipesFlavors')
      .isArray()
      .withMessage('array'),
    body('RecipesDiluents')
      .isArray()
      .withMessage('array')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`request for NEW RECIPE`);
    try {
      // Create the recipe, with associations
      const { userId, name, notes } = req.body;
      const result = await Recipe.create(
        {
          userId,
          name,
          notes,
          RecipesFlavors: req.body.RecipesFlavors, // Array of flavors
          RecipesDiluents: req.body.RecipesDiluents // Array of diluents
        },
        {
          include: [
            {
              model: RecipesFlavors,
              required: true
            },
            {
              model: RecipesDiluents,
              required: true
            }
          ]
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
 * PUT Update Recipe
 * @param id int
 * @body userId int
 * @body name string
 * @body notes string
 * @body RecipesFlavors array
 * @body RecipesDiluents array
 */
router.put(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .toInt(),
    body('userId')
      .isNumeric()
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('notes').isString(),
    body('RecipesFlavors')
      .isArray()
      .withMessage('array'),
    body('RecipesDiluents')
      .isArray()
      .withMessage('array')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`update recipe id ${id}`);
    try {
      // Check recipe exists
      const recipeCheck = await Recipe.findOne({
        where: {
          id
        }
      });

      if (!recipeCheck) {
        // Recipe doesn't exist
        return res.status(204).end();
      }
      // Update the recipe
      const { userId, name, notes } = req.body;
      const recipeResult = await Recipe.update(
        {
          userId,
          name,
          notes
        },
        {
          where: {
            id: req.params.id
          }
        }
      );

      const diluentResult = [];

      for (const diluent of req.body.RecipesDiluents) {
        if (diluent.millipercent === null) {
          // delete
          diluentResult[diluent.diluentId] = await RecipesDiluents.destroy({
            where: {
              recipeId: diluent.recipeId,
              diluentId: diluent.diluentId
            }
          });
        } else {
          diluentResult[diluent.diluentId] = await RecipesDiluents.findOne({
            where: {
              recipeId: diluent.recipeId,
              diluentId: diluent.diluentId
            }
          }).then(async function(obj) {
            if (obj) {
              // update
              return await obj.update({ millipercent: diluent.millipercent });
            } else {
              // insert
              return await RecipesDiluents.create({
                recipeId: diluent.recipeId,
                diluentId: diluent.diluentId,
                millipercent: diluent.millipercent
              });
            }
          });
        }
      }

      const flavorResult = [];

      for (const flavor of req.body.RecipesFlavors) {
        if (flavor.millipercent === null) {
          // delete
          flavorResult[flavor.flavorId] = await RecipesFlavors.destroy({
            where: {
              recipeId: flavor.recipeId,
              flavorId: flavor.flavorId
            }
          });
        } else {
          flavorResult[flavor.flavorId] = await RecipesFlavors.findOne({
            where: {
              recipeId: flavor.recipeId,
              flavorId: flavor.flavorId
            }
          }).then(async function(obj) {
            if (obj) {
              // update
              return await obj.update({ millipercent: flavor.millipercent });
            } else {
              // insert
              return await RecipesFlavors.create({
                recipeId: flavor.recipeId,
                flavorId: flavor.flavorId,
                millipercent: flavor.millipercent
              });
            }
          });
        }
      }

      const result = { recipeResult, diluentResult, flavorResult };

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * DELETE Recipe
 * @param id int
 */
router.delete(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`delete recipe id ${id}`);
    try {
      // Diluents and Flavors must be deleted first
      // Delete Diluents
      const diluentResult = await RecipesDiluents.destroy({
        where: {
          recipeId: id
        }
      });
      // Delete Flavors
      const flavorResult = await RecipesFlavors.destroy({
        where: {
          recipeId: id
        }
      });
      // Once all constraints are deleted, delete recipe
      const recipeResult = await Recipe.destroy({
        where: {
          id
        }
      });

      const result = { recipeResult, diluentResult, flavorResult };

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
