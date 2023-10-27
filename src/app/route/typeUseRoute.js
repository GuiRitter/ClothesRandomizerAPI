import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { create, deleteTypeUse } from '../controller/typeUseController';

const router = express.Router();

router.post('/', verifyAuth, create);
router.delete('/', verifyAuth, deleteTypeUse);

export default router;
