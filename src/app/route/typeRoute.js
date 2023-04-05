import express from 'express';

import { getType } from '../controller/typeController';

const router = express.Router();

router.get('/list', getType);

export default router;
