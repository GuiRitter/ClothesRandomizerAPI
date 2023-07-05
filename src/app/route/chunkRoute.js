import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getChunk, test } from '../controller/chunkController';

const router = express.Router();

router.get('/', verifyAuth, getChunk);
router.get('/test', verifyAuth, test);

export default router;
