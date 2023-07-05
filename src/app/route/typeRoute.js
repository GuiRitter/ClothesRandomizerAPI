import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getType } from '../controller/typeController';

const router = express.Router();

router.get('/list', verifyAuth, getType);

export default router;
