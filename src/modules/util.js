import nanoid from 'nanoid';
import { hash as create, compare } from 'bcrypt';

import configs from './config';

const { api: apiConfig, web: webConfig } = configs;
const {
  passwords: { saltRounds },
  tokens: { length: tokenLength }
} = apiConfig;

export const generateToken = () => {
  return nanoid(tokenLength);
};

export const hashPassword = async password => {
  return await create(password, saltRounds);
};

export const compareHashAndPassword = async (hash, password) => {
  return await compare(password, hash);
};

export const buildWebUrl = path => {
  const { useTls, hostname, port } = webConfig;
  const needsPort = (!useTls && port !== 80) || (useTls && port !== 443);
  const needsSlash = !path.startsWith('/');

  return `http${useTls ? 's' : ''}://${hostname}${needsPort ? `:${port}` : ''}${
    needsSlash ? '/' : ''
  }${path}`;
};

export const isTestEnvironment = () => process.env.NODE_ENV === 'test';
