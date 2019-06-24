import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import responseTime from 'response-time';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import configs from './modules/config';

import flavor from './routes/flavor';
// import recipe from './routes/recipe';
// import vendor from './routes/vendor';

// extract web config and create express app
const { web: config } = configs;

export const app = express();

// auth setup
const { hostname, tokens } = config;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: tokens.secret,
      issuer: hostname,
      audience: hostname
    },
    (_, done) => {
      // this logic allows all valid JWTs
      return done(null, true);
    }
  )
);

// common middleware
app.use(responseTime());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.authenticate('jwt', { session: false }));

// routes
app.use('/flavor', flavor);
// app.use('/recipe', recipe);
// app.use('/vendor', vendor);
