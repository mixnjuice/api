import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';

import models from './database';
import loggers from './logging';

const log = loggers('auth');

passport.use(
  new BearerStrategy(async (token, done) => {
    const { UserToken, User } = models;

    try {
      UserToken.belongsTo(User, { foreignKey: 'userId' });
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
        return done(new Error('Authentication failed'));
      }

      done(null, result[0].User, { scope: 'all' });
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      done(error);
    }
  })
);

export default app => {
  app.use(passport.initialize());
  app.use(passport.authenticate('bearer', { session: false }));
};
