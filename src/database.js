import { Pool } from 'pg';

import configs from './config';

const { database } = configs;

export const pool = new Pool(database);
