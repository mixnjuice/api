import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleValidationErrors,
  handleModelOperation
} from 'modules/utils/request';

const router = Router();
const log = loggers('recipe');
const {
  Diluent,
  Flavor,
  Recipe,
  Preparation,
  UserProfile,
  RecipesFlavors,
  RecipesDiluents,
  PreparationsDiluents
} = models;

/**
 * GET Recipe
 * @param id int
 */
router.get(
  '/:id',
  authenticate(),
  ensurePermission('recipe', 'read'),
  [param('id').isNumeric().isInt({ min: 1 }).toInt()],
  handleValidationErrors(),
  handleModelOperation(Recipe, 'findOne', (req) => ({
    where: {
      id: req.params.id
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
  }))
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
  ensurePermission('recipe', 'create'),
  [
    body('name').isString().isLength({ min: 1 }).withMessage('length'),
    body('volumeMl').isNumeric().toInt(),
    body('notes').isString(),
    body('version').isNumeric().toInt(),
    body('flavors').isArray().withMessage('array'),
    body('recipeDiluents').isArray().withMessage('array'),
    body('preparationDiluents').isArray().withMessage('array')
  ],
  handleValidationErrors(),
  async (req, res) => {
    log.info('Handling request to create new recipe...');
    try {
      // Create the recipe, with associations
      const { id: userId } = req.user;
      const {
        name,
        notes,
        flavors,
        version,
        volumeMl,
        recipeDiluents,
        preparationDiluents
      } = req.body;

      if (version < 1) {
        return res.status(400).end();
      }

      const recipe = await Recipe.create(
        {
          name,
          notes,
          version,
          creatorId: userId,
          RecipeFlavors: flavors,
          RecipeDiluents: recipeDiluents
        },
        {
          include: [
            {
              as: 'RecipeFlavors',
              model: RecipesFlavors,
              required: false
            },
            {
              as: 'RecipeDiluents',
              model: RecipesDiluents,
              required: true
            }
          ]
        }
      );

      if (recipe.length === 0) {
        return res.status(204).end();
      }

      const preparation = await Preparation.create(
        {
          userId,
          volumeMl,
          recipeId: recipe.id,
          PreparationsDiluents: preparationDiluents
        },
        {
          include: [
            {
              as: 'PreparationDiluents',
              model: PreparationsDiluents,
              required: false
            }
          ]
        }
      );

      res.type('application/json');
      res.json({ recipe, preparation });
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
 * @body flavors array
 * @body recipeDiluents array
 */
router.put(
  '/:id',
  authenticate(),
  ensurePermission('recipe', 'update'),
  [
    param('id').isNumeric().toInt(),
    body('userId').isNumeric().toInt(),
    body('name').isString().isLength({ min: 1 }).withMessage('length'),
    body('notes').isString(),
    body('flavors').isArray().withMessage('array'),
    body('recipeDiluents').isArray().withMessage('array')
  ],
  handleValidationErrors(),
  async (req, res) => {
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

      for (const diluent of req.body.recipeDiluents) {
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
          }).then(async function (obj) {
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

      for (const flavor of req.body.flavors) {
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
          }).then(async function (obj) {
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
  ensurePermission('recipe', 'delete'),
  [param('id').isNumeric().toInt()],
  handleValidationErrors(),
  async (req, res) => {
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
