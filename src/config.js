import dotenv from 'dotenv';

const config = dotenv.config();

if (config.error) {
  throw config.error;
}

export default config.parsed;
