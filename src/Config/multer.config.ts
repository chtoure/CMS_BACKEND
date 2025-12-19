import multer from 'multer';
import path from 'path';
import { mimeTypes } from '../Utils/Constantes/config.constant.ts';

const tempsDir = path.join(__dirname,'..', '..', 'media', 'uploads');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, tempsDir);
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random());
        const originalExtension = path.extname(file.originalname);

        cb(null, file.fieldname + '_' + uniqueSuffix + originalExtension);
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