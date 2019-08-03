import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { env: config } = process;

const boolean = /^true$/i;

export default {
  web: {
    hostname: config.WEB_HOSTNAME,
    port: parseInt(config.WEB_PORT, 10),
    useTls: !config.WEB_USE_TLS || boolean.test(config.WEB_USE_TLS)
  },
  api: {
    hostname: config.API_HOST,
    port: parseInt(config.API_PORT, 10),
    passwords: {
      saltRounds: parseInt(config.API_PASSWORD_SALT_ROUNDS, 10)
    },
    tokens: {
      length: parseInt(config.API_TOKEN_LENGTH, 10),
      age: parseInt(config.API_TOKEN_AGE, 10),
      validate:
        !config.API_TOKEN_VALIDATE || boolean.test(config.API_TOKEN_VALIDATE)
    },
    roles: {
      validate:
        !config.API_ROLE_VALIDATE || boolean.test(config.API_ROLE_VALIDATE)
    }
  },
  email: {
    region: config.AWS_REGION,
    fromAddress: config.API_EMAIL_FROM_ADDRESS,
    simulate:
      !config.API_EMAIL_SIMULATE || boolean.test(config.API_EMAIL_SIMULATE)
  },
  database: {
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT, 10),
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASS
  }
};
