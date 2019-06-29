import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import nanoid from 'nanoid';
import passport from 'passport';
import oauth2orize from 'oauth2orize';
import BearerStrategy from 'passport-http-bearer';

import configs from './config';
import models from './database';
import loggers from './logging';

const log = loggers('auth');
const { UserToken, User } = models;

const { web: webConfig } = configs;
const { age: tokenAge, length: tokenLength } = webConfig.tokens;

const generateToken = () => {
  return nanoid(tokenLength);
};

const compareHashAndPassword = async (hash, password) => {
  return await bcrypt.compare(password, hash);
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
          emailAddress: username
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

      const user = result.shift();
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
          expires: dayjs().add(tokenAge, 'minutes')
        });

        done(null, accessToken, refreshToken, result);
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
    }
  })
);

export default app => {
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        if (!token.trim()) {
          return done(
            new oauth2orize.TokenError('Missing token!', 'invalid_request')
          );
        }

        const result = await UserToken.findAll({
          where: {
            token
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
            new oauth2orize.TokenError(
              'Authentication failed.',
              'invalid_grant'
            )
          );
        }

        const user = result.shift().User;

        done(null, user, { scope: 'all' });
      } catch (error) {
        log.error(error.message);
        log.error(error.stack);
        done(new oauth2orize.OAuth2Error(error));
      }
    })
  );

  // allow requests to obtain a token
  app.post('/oauth/token', authServer.token(), authServer.errorHandler());

  // put all API routes behind bearer token auth
  app.use('/api/*', passport.initialize());
  app.use('/api/*', passport.authenticate('bearer', { session: false }));
};
