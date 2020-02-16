import { Router } from 'express';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import { handleCount, handleFindAll } from 'modules/utils/request';

const router = Router();
const { Role } = models;

/**
 * GET Roles
 */
router.get('/', authenticate(), handleFindAll(Role));

/**
 * GET Roles Stats
 */
router.get('/count', authenticate(), handleCount(Role));

export default router;
