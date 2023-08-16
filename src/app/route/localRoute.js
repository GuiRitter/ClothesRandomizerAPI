import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getLocal, deleteCascadeLocal } from '../controller/localController';

const router = express.Router();

router.delete('/', verifyAuth, deleteCascadeLocal);
router.get('/list', verifyAuth, getLocal);

export default router;
