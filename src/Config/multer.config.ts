import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { mimeTypes } from '../Utils/Constantes/config.constant.ts';

const tempsDir = path.join(process.cwd(), 'media', 'uploads');

if (!fs.existsSync(tempsDir)) {
  fs.mkdirSync(tempsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let finalDir;

    if (file.mimetype.startsWith('image/')) {
      finalDir = path.join(tempsDir, 'images');
    } else {
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
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Type de fichier non autorisé'
      )
    );
  }
};

function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          message: 'Fichier trop volumineux (max 10 Mo)',
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(415).json({
          message: err.message || 'Type de fichier non autorisé',
        });

      default:
        return res.status(400).json({
          message: err.message,
        });
    }
  }

  next(err);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export { upload, multerErrorHandler };
