import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { deleteCascadePieceOfClothing, getPieceOfClothing } from '../controller/pieceOfClothingController';

const router = express.Router();

router.delete('/', verifyAuth, deleteCascadePieceOfClothing);
router.get('/list', verifyAuth, getPieceOfClothing);

export default router;
