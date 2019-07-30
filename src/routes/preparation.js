import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('preparation');
const {
  Diluent,
  Flavor,
  Preparation,
  PreparationsDiluents,
  Recipe,
  RecipesDiluents,
  RecipesFlavors,
  UserProfile
} = models;

/**
 * GET Preparation
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

    log.info(`request for preparation ${id}`);
    try {
      // Get the preparation, with associations
      const result = await Preparation.findOne({
        where: {
          id
        },
        include: [
          {
            model: UserProfile,
            required: true
          },
          {
            model: Recipe,
            required: true,
            include: [
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
          },
          {
            model: PreparationsDiluents,
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
 * POST Create a Preparation
 * @body recipeId int
 * @body userId int
 * @body volumeMl int
 * @body nicotineMillipercent int
 * @body PreparationsDiluents array
 */
router.post(
  '/',
  authenticate(),
  [
    body('recipeId')
      .isNumeric()
      .toInt(),
    body('userId')
      .isNumeric()
      .toInt(),
    body('volumeMl')
      .isNumeric()
      .toInt(),
    body('nicotineMillipercent').isString(),
    body('PreparationsDiluents')
      .isArray()
      .withMessage('array')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { recipeId, userId, volumeMl, nicotineMillipercent } = req.body;

    log.info(`request for NEW PREPARATION`);
    try {
      // Check recipe exists
      const recipeCheck = await Recipe.findOne({
        where: {
          id: req.body.recipeId
        }
      });

      if (recipeCheck.length === 0) {
        // Recipe doesn't exist
        res.statusMessage = `Recipe ID ${req.body.recipeId} Requested for Preparation Does Not Exist`;
        return res.status(204).end();
      }
      // Create the preparation, with associations
      const result = await Preparation.create(
        {
          recipeId,
          userId,
          volumeMl,
          nicotineMillipercent,
          viewCount: 0,
          PreparationsDiluents: req.body.PreparationsDiluents // Array of diluents
        },
        {
          include: [
            {
              model: PreparationsDiluents,
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
 * PUT Update a Preparation
 * - Doesn't allow the Recipe ID or User ID to change
 * @param id int
 * @body volumeMl int
 * @body nicotineMillipercent int
 * @body PreparationsDiluents array
 */
router.put(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .toInt(),
    body('volumeMl')
      .isNumeric()
      .toInt(),
    body('nicotineMillipercent').isString(),
    body('PreparationsDiluents')
      .isArray()
      .withMessage('array')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`update preparation id ${id}`);
    try {
      // Check Preparation exists
      const preparationCheck = await Preparation.findOne({
        where: {
          id
        }
      });

      if (preparationCheck.length === 0) {
        // Preparation doesn't exist
        res.statusMessage = `Preparation ID ${req.params.id} Does Not Exist`;
        return res.status(204).end();
      }
      // Update the preparation
      const { volumeMl, nicotineMillipercent } = req.body;
      const preparationResult = await Preparation.update(
        {
          volumeMl,
          nicotineMillipercent
        },
        {
          where: {
            id: req.params.id
          }
        }
      );

      const diluentResult = [];

      for (const diluent of req.body.PreparationsDiluents) {
        if (diluent.millipercent === null) {
          // delete
          diluentResult[diluent.diluentId] = await PreparationsDiluents.destroy(
            {
              where: {
                preparationId: diluent.preparationId,
                diluentId: diluent.diluentId
              }
            }
          );
        } else {
          diluentResult[diluent.diluentId] = await PreparationsDiluents.findOne(
            {
              where: {
                preparationId: diluent.preparationId,
                diluentId: diluent.diluentId
              }
            }
          ).then(function(obj) {
            if (obj) {
              // update
              return obj.update({
                millipercent: diluent.millipercent,
                nicotineConcentration: diluent.nicotineConcentration
              });
            } else {
              // insert
              return PreparationsDiluents.create({
                preparationId: diluent.preparationId,
                diluentId: diluent.diluentId,
                millipercent: diluent.millipercent,
                nicotineConcentration: diluent.nicotineConcentration
              });
            }
          });
        }
      }

      const result = { preparationResult, diluentResult };

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
 * DELETE Preparation
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

    log.info(`delete preparation id ${id}`);
    try {
      // Delete Diluents First
      const diluentResult = await PreparationsDiluents.destroy({
        where: {
          preparationId: req.params.id
        }
      });
      // Once all constraints are deleted, delete recipe
      const preparationResult = await Preparation.destroy({
        where: {
          id
        }
      });

      const result = { preparationResult, diluentResult };

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
