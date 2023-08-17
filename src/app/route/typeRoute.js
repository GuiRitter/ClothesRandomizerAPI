import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { deleteCascadePieceOfClothingType, getType } from '../controller/typeController';

const router = express.Router();

router.delete('/', verifyAuth, deleteCascadePieceOfClothingType);
router.get('/list', verifyAuth, getType);

export default router;
