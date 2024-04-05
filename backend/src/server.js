import dotenv from 'dotenv';
dotenv.config(); // by calling dotenv's config function, it will read .env file and use the keys inside as environment variables
import { fileURLToPath } from 'url' ;
import express from 'express'; // this kind of import doesn't work by default, this is a module type. Enable it in package.json
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';

import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
dbconnect();

// full address of current file
const __filename = fileURLToPath(import.meta.url);
// gets current directory of file
const __dirname = dirname(__filename); // be sure to enter in dirname()

// create the express app by calling default express
const app = express();

// since using req.body and want to send body data to server as json, need to tell express app to use json for body
app.use(express.json());

// the localhost:3000 is the react app, so can't have the express app on the same port
app.use( 
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);


// joins "directory + '/' + public" into a string
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

app.get('*', (req, res) => {
    // index.html is the frontend side so now it is usable from the backend
    const indexFilePath = path.join(publicFolder, 'index.html'); // be sure to enter in path
    res.sendFile(indexFilePath);
});

/* If port is null/undefined or on localhost while developing, use 5000.
But, if on server, render.com will provide a PORT number. */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});