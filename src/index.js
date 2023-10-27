import 'dotenv/config'; // always first import
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';

import chunkRoute from './app/route/chunkRoute';
import localRoute from './app/route/localRoute';
import pieceOfClothingRoute from './app/route/pieceOfClothingRoute';
import typeRoute from './app/route/typeRoute';
import typeUseRoute from './app/route/typeUseRoute';
import useRoute from './app/route/useRoute';
import userRoute from './app/route/userRoute';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/clothes_randomizer/api/chunk', chunkRoute);
app.use('/clothes_randomizer/api/local', localRoute);
app.use('/clothes_randomizer/api/piece_of_clothing', pieceOfClothingRoute);
app.use('/clothes_randomizer/api/type', typeRoute);
app.use('/clothes_randomizer/api/type_use', typeUseRoute);
app.use('/clothes_randomizer/api/use', useRoute);
app.use('/clothes_randomizer/api/user', userRoute);

app.listen(process.env.PORT, '127.0.0.1').on('listening', () => {
	console.log(`${(new Date()).toISOString()} are live on ${process.env.PORT}`);
});

export default app;
