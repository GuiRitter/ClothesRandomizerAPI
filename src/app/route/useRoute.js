import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getUse } from '../controller/useController';

const router = express.Router();

router.get('/list', verifyAuth, getUse);

export default router;
