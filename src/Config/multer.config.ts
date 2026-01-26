import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { mimeTypes } from '../Utils/Constantes/config.constant.ts';

const baseUploadDir = path.join(process.cwd(), 'media', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = 'others';

    // 1. Détermination du sous-dossier
    if (file.mimetype.startsWith('image/')) {
      subDir = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subDir = 'videos';
    } else if (
      file.mimetype.includes('pdf') || 
      file.mimetype.includes('msword') || 
      file.mimetype.includes('officedocument') ||
      file.mimetype.startsWith('text/')
    ) {
      subDir = 'documents';
    } else if (
      file.mimetype.includes('zip') || 
      file.mimetype.includes('x-rar') || 
      file.mimetype.includes('tar') || 
      file.mimetype.includes('compressed')
    ) {
      subDir = 'archives';
    }

    const finalDir = path.join(baseUploadDir, subDir);

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    cb(null, finalDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
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
        `Type ${file.mimetype} non autorisé`
      )
    );
  }
};

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          message: 'Fichier trop volumineux (max 50 Mo)',
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

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});