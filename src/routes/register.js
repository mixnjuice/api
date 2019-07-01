import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import Email from '../modules/email';
import models from '../modules/database';
import loggers from '../modules/logging';
import configs from '../modules/config';
import { generateToken } from '../modules/auth';

const router = Router();
const log = loggers('register');
const { User, UserProfile } = models;
const { email: emailConfig } = configs;
const emailer = new Email(emailConfig);

router.post(
  '/register',
  [
    check('username').isLength(4, 64),
    check('emailAddress')
      .isEmail()
      .isLength(0, 200),
    check('password').isLength(8)
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      log.info('Starting user registration');
      const { emailAddress, password, username } = req.body;
      const activationCode = generateToken();

      await models.sequelize.transaction(async transaction => {
        const newUser = await User.create(
          {
            emailAddress,
            password,
            activationCode
          },
          { transaction }
        );

        await UserProfile.create(
          {
            userId: newUser.id,
            name: username
          },
          { transaction }
        );
      });

      await emailer.createActivationMessage();
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      res.status(500).end();
    }
  }
);

export default router;
