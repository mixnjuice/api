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

export const handleFindAll = (model, queryMapper = () => undefined) => async (
  req,
  res
) => {
  try {
    const result = await model.findAll(queryMapper(req));

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

export const handleCount = model => async (req, res) => {
  try {
    const result = await model.count();

    res.type('application/json');
    return res.json({ result });
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    return res.status(500).send(error.message);
  }
};

export const handleModelOperation = (
  model,
  operation,
  argMapper = () => []
) => async (req, res) => {
  log.info(`request to ${operation} ${model.name}`);
  try {
    const result = await model[operation](...argMapper(req));

    if (result.length === 0) {
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
