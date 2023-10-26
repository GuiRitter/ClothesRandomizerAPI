import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { createLocal, deleteCascadeLocal, getLocal, updateLocal } from '../controller/localController';

const router = express.Router();

router.post('/', verifyAuth, createLocal);
router.delete('/', verifyAuth, deleteCascadeLocal);
router.get('/list', verifyAuth, getLocal);
router.patch('/', verifyAuth, updateLocal);

export default router;
