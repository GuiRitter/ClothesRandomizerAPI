import express from 'express';

import { getUse } from '../controller/useController';

const router = express.Router();

router.get('/list', getUse);

export default router;
