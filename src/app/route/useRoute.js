import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { decrement, getUse, increment } from '../controller/useController';

const router = express.Router();

router.post('/decrement', verifyAuth, decrement);
router.get('/list', verifyAuth, getUse);
router.post('/increment', verifyAuth, increment);

export default router;
