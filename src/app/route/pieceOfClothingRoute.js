import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { createPieceOfClothing, deleteCascadePieceOfClothing, getPieceOfClothing } from '../controller/pieceOfClothingController';

const router = express.Router();

router.post('/', verifyAuth, createPieceOfClothing);
router.delete('/', verifyAuth, deleteCascadePieceOfClothing);
router.get('/list', verifyAuth, getPieceOfClothing);

export default router;
