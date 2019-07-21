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

    log.info(`request for ${req.params.id}`);
    try {
      const result = await Recipe.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: UserProfile,
            required: true
          },
          {
            model: RecipesFlavors,
            required: true,
            include: [
              {
                model: Flavor,
                required: true
              }
            ]
          },
          {
            model: RecipesDiluents,
            required: true,
            include: [
              {
                model: Diluent,
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
 * POST Create a Recipe and associations
 * @body userid int
 * @body name string
 * @body notes string
 * @body flavors array
 * @body diluents array
 */
router.post(
  '/',
  authenticate(),
  [
    body('userid')
      .isNumeric()
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('notes').isString(),
    body('flavors')
      .isArray()
      .withMessage('array'),
    body('diluents')
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
      const result = await Recipe.create(
        {
          userId: req.body.userid,
          name: req.body.name,
          viewCount: 0,
          notes: req.body.notes,
          RecipesFlavors: req.body.flavors, // Array of flavors
          RecipesDiluents: req.body.diluents // Array of diluents
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
 * @body userid int
 * @body name string
 * @body notes string
 * @body flavors array
 * @body diluents array
 */
router.put(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .toInt(),
    body('userid')
      .isNumeric()
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('notes').isString(),
    body('flavors')
      .isArray()
      .withMessage('array'),
    body('diluents')
      .isArray()
      .withMessage('array')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    log.info(`update recipe id ${req.params.id}`);
    try {
      const recipeResult = await Recipe.update(
        {
          userId: req.body.userid,
          name: req.body.name,
          notes: req.body.notes
        },
        {
          where: {
            id: req.params.id
          }
        }
      );

      const diluentResult = [];

      for (const diluent of req.body.diluents) {
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
          }).then(function(obj) {
            if (obj) {
              // update
              return obj.update({ millipercent: diluent.millipercent });
            } else {
              // insert
              return RecipesDiluents.create({
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
          }).then(function(obj) {
            if (obj) {
              // update
              return obj.update({ millipercent: flavor.millipercent });
            } else {
              // insert
              return RecipesFlavors.create({
                recipeId: flavor.recipeId,
                flavorId: flavor.flavorId,
                millipercent: flavor.millipercent
              });
            }
          });
        }
      }

      const result = { recipeResult, diluentResult, flavorResult };

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

    log.info(`delete recipe id ${req.params.id}`);
    try {
      const diluentResult = await RecipesDiluents.destroy({
        where: {
          recipeId: req.params.id
        }
      });

      const flavorResult = await RecipesFlavors.destroy({
        where: {
          recipeId: req.params.id
        }
      });

      const recipeResult = await Recipe.destroy({
        where: {
          id: req.params.id
        }
      });

      const result = { recipeResult, diluentResult, flavorResult };

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
