import { Router } from 'express';
import { check, query, validationResult } from 'express-validator/check';

import Email from '../modules/email';
import models, { handleError } from '../modules/database';
import logging from '../modules/logging';
import configs from '../modules/config';
import { hashPassword, generateToken, buildWebUrl } from '../modules/util';

const router = Router();
const log = logging('register');
const { User, UserProfile } = models;
const { email: emailConfig, api: apiConfig } = configs;
const {
  tokens: { length: tokenLength }
} = apiConfig;
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
      const url = buildWebUrl(`/register/activate?code=${activationCode}`);
      const message = emailer.createActivationEmail(emailAddress, url);

      emailer.sendMessage(message);
      res.status(200).end();
    } catch (error) {
      handleError(error, res);
    }
  }
);

router.get('/activate', [
  query('code')
    .isLength({ min: tokenLength, max: tokenLength })
    .withMessage('length')
    .matches(/[A-Za-z0-9_-]+/)
    .withMessage('format'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code: activationCode } = req.query;

    try {
      const result = await User.findAll({
        where: {
          activationCode
        }
      });

      if (!Array.isArray(result) || result.length === 0) {
        return res.status(400).end();
      }

      const [user] = result;

      user.set('activationCode', null);
      await user.save();
      res.redirect(buildWebUrl('/login'));
    } catch (error) {
      handleError(error, res);
    }
  }
]);

export default router;
