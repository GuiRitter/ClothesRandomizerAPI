import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { createPieceOfClothing, deleteCascadePieceOfClothing, getPieceOfClothing, updatePieceOfClothing } from '../controller/pieceOfClothingController';

const router = express.Router();

router.post('/', verifyAuth, createPieceOfClothing);
router.delete('/', verifyAuth, deleteCascadePieceOfClothing);
router.get('/list', verifyAuth, getPieceOfClothing);
router.patch('/', verifyAuth, updatePieceOfClothing);

export default router;
