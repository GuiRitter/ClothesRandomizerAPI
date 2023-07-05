import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getLocal } from '../controller/localController';

const router = express.Router();

router.get('/list', verifyAuth, getLocal);

export default router;
