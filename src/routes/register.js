import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import Email from '../modules/email';
import models from '../modules/database';
import loggers from '../modules/logging';
import configs from '../modules/config';
import { hashPassword, generateToken } from '../modules/auth';

const router = Router();
const log = loggers('register');
const { User, UserProfile } = models;
const { email: emailConfig, web: webConfig } = configs;
const emailer = new Email(emailConfig);

router.post(
  '/',
  [
    check('username')
      .isLength(4, 64)
      .withMessage('length'),
    check('emailAddress')
      .isEmail()
      .withMessage('email')
      .isLength(0, 200)
      .withMessage('length'),
    check('password')
      .isLength(8)
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      log.info('Starting user registration');
      const { emailAddress, password: rawPassword, username } = req.body;
      const activationCode = generateToken();
      const password = await hashPassword(rawPassword);

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

      // build activation URL
      const { hostname, port } = webConfig;

      let url = `https://${hostname}`;

      if (port !== 443) {
        url += `:${port}`;
      }

      url += `/register/activate?code=${activationCode}`;

      await emailer.sendActivationEmail(emailAddress, url);

      res.status(200).end();
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      res.status(500).end();
    }
  }
);

export default router;
