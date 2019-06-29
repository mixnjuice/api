import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { env: config } = process;

export default {
  web: {
    hostname: config.API_HOST,
    port: config.API_PORT,
    passwords: {
      saltRounds: config.API_PASSWORD_SALT_ROUNDS
    },
    tokens: {
      age: config.API_TOKEN_AGE
    }
  },
  database: {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASS
  }
};
