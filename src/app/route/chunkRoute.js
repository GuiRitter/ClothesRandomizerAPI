import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getChunk } from '../controller/chunkController';

const router = express.Router();

router.get('/', verifyAuth, getChunk);

export default router;
