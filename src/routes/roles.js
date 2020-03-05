import { Router } from 'express';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import { handleCount, handleFindAll } from 'modules/utils/request';

const router = Router();
const { Role } = models;

/**
 * GET Roles
 */
router.get(
  '/',
  authenticate(),
  ensurePermission('roles', 'read'),
  handleFindAll(Role)
);

/**
 * GET Roles Stats
 */
router.get(
  '/count',
  authenticate(),
  ensurePermission('roles', 'read'),
  handleCount(Role)
);

export default router;
