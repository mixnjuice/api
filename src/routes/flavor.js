import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import database from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('flavor');

router.get(
  '/:id',
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
      const result = await database.sequelize.query(
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
      );

      if (result[0].length === 0) {
        return res.writeHead(204).end();
      }

      res.type('application/json');
      res.json(result.shift().shift());
    } catch (error) {
      log.error(error.message);
      res.writeHead(500).end(error.message);
    }
  }
);

export default router;
