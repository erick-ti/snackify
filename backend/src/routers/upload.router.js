import { Router } from 'express';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';
import multer from 'multer';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { configCloundinary } from '../config/cloudinary.config.js';

const router = Router();
// provides several useful functions for middleware ('.single')
const upload = multer();

router.post(
    '/',
    admin,
    upload.single('image'),
    handler(async (req, res) => {
        const file = req.file;
        // error handling
        if (!file) {
            res.status(BAD_REQUEST).send();
            return;
        }

        const imageURL = await uploadImageToCloundinary(req.file?.buffer); // buffer - temporary memory
        res.send({imageURL});
    })
);

const uploadImageToCloundinary = imageBuffer => {
    const cloudinary = configCloundinary();

    return new Promise(( resolve, reject ) => {
        if(!imageBuffer) reject(null);

        cloudinary.uploader
            .upload_stream((error, result) => {
                if(error || !result) reject(error);
                else resolve(result.url);
            })
            .end(imageBuffer);
    });
};

export default router;
