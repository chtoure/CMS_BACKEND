import type { Request, Response, NextFunction } from 'express';
import { buildJoiSchema } from '../Utils/Validations/ContentEntrySchema.ts';
import prisma from '../Utils/PrismaClient.ts';
import Joi from 'joi';

const validateDynamicContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { data_json, parentId, status } = req.body;

    if (!slug) {
      return res.status(400).json({ message: "Le paramètre slug est manquant." });
    }

    const contentType = await prisma.contentType.findUnique({
      where: { slug }
    });

    if (!contentType) {
      return res.status(404).json({ message: "Type de contenu inconnu." });
    }

    const dynamicSchema = buildJoiSchema(contentType.fields_schema as any);
    const { error: jsonError, value: validatedJson } = dynamicSchema.validate(data_json, {
      abortEarly: false,
      allowUnknown: true
    });

    if (jsonError) {
      return res.status(400).json({ 
        message: "Erreur de validation des champs", 
        errors: jsonError.details.map(err => ({ field: err.path[0], message: err.message })) 
      });
    }

    const entryMetaSchema = Joi.object({
      parentId: Joi.number().integer().allow(null).optional(),
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').optional()
    });

    const { error: metaError } = entryMetaSchema.validate({ parentId, status });
    if (metaError) {
      return res.status(400).json({ message: "Métadonnées invalides", errors: metaError.details });
    }

    if (parentId) {
      const parentExists = await prisma.contentEntry.findUnique({
        where: { id: parentId }
      });
      if (!parentExists) {
        return res.status(400).json({ message: "L'entrée parente spécifiée n'existe pas." });
      }
    }

    req.body.data_json = validatedJson;
    req.body.contentTypeId = contentType.id; 
    
    next();
  } catch (err) {
    console.error("Erreur Middleware Validation:", err);
    res.status(500).json({ message: "Erreur lors de la validation dynamique." });
  }
};


export {
  validateDynamicContent
}