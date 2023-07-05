import express from 'express';

import { getChunk, test } from '../controller/chunkController';

const router = express.Router();

router.get('/', getChunk);
router.get('/test', test);

export default router;
