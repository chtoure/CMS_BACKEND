import multer from 'multer';
import path from 'path';
import { mimeTypes } from '../Utils/Constantes/config.constant.ts';
import fs from 'fs';

const tempsDir = path.join(process.cwd(), 'media', 'uploads');

if (!fs.existsSync(tempsDir)) {
    fs.mkdirSync(tempsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination : (req, file, cb) => {

        let finalDir

        if (file.mimetype.startsWith('image/')) {

            finalDir = path.join(tempsDir, 'images');
            
        }else{
            finalDir = path.join(tempsDir, 'videos');
        }

        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }

        cb(null, finalDir);
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random());
        const originalExtension = path.extname(file.originalname);

        cb(null, uniqueSuffix + originalExtension);
    }
})



const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

    const allowedMimeTypes= mimeTypes;

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }else{
        cb(null, false);
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 
    }
});