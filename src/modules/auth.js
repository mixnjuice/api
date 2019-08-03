import dayjs from 'dayjs';
import passport from 'passport';
import oauth2orize from 'oauth2orize';
import BearerStrategy from 'passport-http-bearer';
import AnonymousStrategy from 'passport-anonymous';

import configs from './config';
import models from './database';
import loggers from './logging';
import { compareHashAndPassword, generateToken } from './util';

const log = loggers('auth');
const { Op } = models.Sequelize;
const { UserToken, User, Role } = models;

const { api: webConfig } = configs;
const { age: tokenAge, validate: validateTokens } = webConfig.tokens;

const authorize = async (token, done) => {
  try {
    if (!token.trim()) {
      return done(
        new oauth2orize.TokenError('Missing token!', 'invalid_request')
      );
    }

    const result = await UserToken.findAll({
      where: {
        token,
        expires: {
          [Op.gt]: Date.now()
        }
      },
      include: [
        {
          model: User,
          required: true
        }
      ]
    });

    if (!Array.isArray(result) || result.length === 0) {
      return done(
        new oauth2orize.TokenError('Authentication failed.', 'invalid_grant')
      );
    }

    const [{ User: user }] = result;

    done(null, user, { scope: 'all' });
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    done(new oauth2orize.OAuth2Error(error));
  }
};

const authServer = oauth2orize.createServer();

authServer.exchange(
  oauth2orize.exchange.password(async (_, username, password, __, done) => {
    try {
      if (!username.trim() || !password.trim()) {
        return done(
          new oauth2orize.AuthorizationError(
            'Missing username or password!',
            'invalid_request'
          )
        );
      }

      const result = await User.findAll({
        where: {
          emailAddress: username,
          activationCode: null
        }
      });

      if (!Array.isArray(result) || result.length === 0) {
        return done(
          new oauth2orize.AuthorizationError(
            'Authentication failed.',
            'access_denied'
          )
        );
      }

      const [user] = result;
      const valid = await compareHashAndPassword(
        user.get('password'),
        password
      );

      if (valid) {
        const accessToken = await generateToken();
        // this is currently thrown away
        const refreshToken = await generateToken();

        UserToken.create({
          token: accessToken,
          userId: user.id,
          expires: dayjs().add(tokenAge, 'seconds')
        });

        done(null, accessToken, refreshToken, {
          /* eslint-disable-next-line camelcase */
          expires_in: tokenAge,
          userId: user.id
        });
      } else {
        done(
          new oauth2orize.AuthorizationError(
            'Authentication failed.',
            'access_denied'
          )
        );
      }
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      done(error);
    }
  })
);

/**
 * Provide a wrapper around passport.authenticate with the appropriate strategies selected.
 */
export const authenticate = () => {
  const { NODE_ENV: environment } = process.env;
  const useBearerStrategy = environment !== 'test' && validateTokens;

  return [
    passport.initialize(),
    passport.authenticate(useBearerStrategy ? 'bearer' : 'anonymous', {
      session: false
    })
  ];
};

export const ensureRole = name => async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      throw new Error('No user found!');
    }

    const id = parseInt(user.id, 10);

    const role = await Role.findOne({
      where: {
        name
      },
      include: [
        {
          as: 'Users',
          model: User,
          required: true,
          through: {
            where: { userId: id }
          }
        }
      ]
    });

    if (!role) {
      throw new Error('User lacks required role!');
    }

    next(null);
  } catch (error) {
    next(error);
  }
};

export default app => {
  passport.use(
    validateTokens ? new BearerStrategy(authorize) : new AnonymousStrategy()
  );

  // allow requests to obtain a token
  app.post('/oauth/token', authServer.token(), authServer.errorHandler());
};
