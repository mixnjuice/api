import dayjs from 'dayjs';
import passport from 'passport';
import oauth2orize from 'oauth2orize';
import BearerStrategy from 'passport-http-bearer';
import AnonymousStrategy from 'passport-anonymous';

import { api as webConfig } from 'modules/config';
import models from 'modules/database';
import logging from 'modules/logging';
import { compareHashAndPassword, generateToken } from 'modules/utils';
import { isTestEnvironment } from 'modules/utils/test';
import MockStrategy from 'passport-mock-strategy';

const log = logging('auth');
const { Op } = models.Sequelize;
const { UserToken, User, Role } = models;

const { age: tokenAge, validate: validateTokens } = webConfig.tokens;
const { validate: validateRoles } = webConfig.roles;

const authorize = async (token, done) => {
  try {
    if (!token.trim()) {
      return done(
        new oauth2orize.TokenError('Missing token!', 'invalid_request')
      );
    }

    const userToken = await UserToken.findOne({
      where: {
        token,
        expires: {
          [Op.gt]: Date.now()
        }
      }
    });

    if (!userToken) {
      return done(
        new oauth2orize.TokenError('Authentication failed.', 'invalid_grant')
      );
    }

    const user = await User.findOne({
      where: {
        id: userToken.userId
      },
      include: [
        {
          model: Role,
          as: 'Roles'
        }
      ]
    });

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
  const useBearerStrategy = !isTestEnvironment() && validateTokens;

  return [
    passport.initialize(),
    passport.authenticate(useBearerStrategy ? 'bearer' : 'anonymous', {
      session: false
    })
  ];
};

export const ensureRole = name => async (req, _, next) => {
  if (isTestEnvironment() || !validateRoles) {
    return next(null);
  }

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

export const useMockStrategy = (passportRef, user) =>
  passportRef.use(
    new MockStrategy({
      name: 'anonymous',
      user
    })
  );

export default app => {
  passport.use(
    validateTokens ? new BearerStrategy(authorize) : new AnonymousStrategy()
  );

  // allow requests to obtain a token
  app.post('/oauth/token', authServer.token(), authServer.errorHandler());
};
