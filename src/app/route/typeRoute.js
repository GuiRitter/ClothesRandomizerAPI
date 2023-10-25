import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { createType, deleteCascadePieceOfClothingType, getType } from '../controller/typeController';

const router = express.Router();

router.post('/', verifyAuth, createType);
router.delete('/', verifyAuth, deleteCascadePieceOfClothingType);
router.get('/list', verifyAuth, getType);

export default router;
