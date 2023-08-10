import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPieceOfClothing } from '../controller/pieceOfClothingController';

const router = express.Router();

router.get('/list', verifyAuth, getPieceOfClothing);

export default router;
