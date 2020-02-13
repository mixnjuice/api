import { validationResult } from 'express-validator';

import loggers from 'modules/logging';

const log = loggers('requestUtils');

export const handleValidationErrors = () => (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    log.error(`Model failed validation!`);
    const errorArray = errors.array();

    log.error(JSON.stringify(errorArray));
    return res.status(400).json({ errors: errorArray });
  } else {
    return next();
  }
};

export const fetchAll = (model, query) => async (req, res) => {
  try {
    const result = await model.findAll(query);

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(204).end();
    }

    res.type('application/json');
    return res.json(result);
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    return res.status(500).send(error.message);
  }
};

export const countAll = model => async (req, res) => {
  try {
    const result = await model.count();

    res.type('application/json');
    return res.json({ result });
  } catch (error) {
    log.error(error.message);
    return res.status(500).send(error.message);
  }
};
