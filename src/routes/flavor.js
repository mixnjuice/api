import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import { pool } from '../database';
import loggers from '../logging';

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
      const result = await pool.query(
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
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.writeHead(204).end();
      }

      res.writeHead(200).end(JSON.stringify(result.rows.shift()));
    } catch (error) {
      log.error(error.message);
      res.writeHead(500).end(error.message);
    }
  }
);

export default router;
