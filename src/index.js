import 'dotenv/config'; // always first import
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';

import localRoute from './app/route/localRoute';
import typeRoute from './app/route/typeRoute';
import useRoute from './app/route/useRoute';
import userRoute from './app/route/userRoute';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/clothes_randomizer/api/local', localRoute);
app.use('/clothes_randomizer/api/type', typeRoute);
app.use('/clothes_randomizer/api/use', useRoute);
app.use('/clothes_randomizer/api/user', userRoute);

app.listen(process.env.PORT, '127.0.0.1').on('listening', () => {
	console.log(`${(new Date()).toISOString()} are live on ${process.env.PORT}`);
});

export default app;
