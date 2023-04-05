import express from 'express';

import { getLocal } from '../controller/localController';

const router = express.Router();

router.get('/list', getLocal);

export default router;
