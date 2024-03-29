import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { checkToken, signIn } from '../controller/userController';

const router = express.Router();

router.get('/check', verifyAuth, checkToken);
router.post('/sign_in', signIn);

export default router;

