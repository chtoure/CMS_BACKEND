import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
import { HTTP_STATUS_BAD_REQUEST } from '../Utils/Constantes/ConstantesHttp.js';

const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((err) => err.message);
      res.status(HTTP_STATUS_BAD_REQUEST).json({ erreurs: messages });
      return;
    }

    // On ecrase les données brutes pour mettre ceux validés
    req.body = value;
    next();
  };
};

export default validateBody;