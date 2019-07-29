import { Router } from 'express';
import { param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('flavor');
const { Flavor, Vendor } = models;

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
      /* const result = await database.sequelize.query(
        `select
          v.code vendor_code,
          v.name vendor_name,
          f.name flavor_name
        from
          flavor f
          join vendor v
            on f.vendor_id = v.id
        where
          f.id = $1::bigint`,
        { bind: [req.params.id] }
      );*/
      const result = await Flavor.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Vendor,
            require: true
          }
        ]
      });

      if (!result || result.length === 0) {
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
