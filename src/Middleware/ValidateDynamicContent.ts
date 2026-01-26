import type { Request, Response, NextFunction } from 'express';
import { buildJoiSchema } from '../Utils/Validations/ContentEntrySchema.ts';
import prisma from '../Utils/PrismaClient.ts';
import Joi from 'joi';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } from '../Utils/Constantes/ConstantesHttp.ts';
import type { IFieldDefinition } from '../Types/InputField.ts';

const validateDynamicContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { data_json, status } = req.body;

    if (!slug) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
    }

    // 1. Trouver le ContentType
    const contentType = await prisma.contentType.findUnique({
      where: { slug }
    });

    if (!contentType) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Type de contenu inconnu." });
    }

    // 2. Valider le contenu dynamique (data_json)
    const dynamicSchema = buildJoiSchema(contentType.fields_schema as unknown as IFieldDefinition[]);
    const { error: jsonError, value: validatedJson } = dynamicSchema.validate(data_json, {
      abortEarly: false,
      stripUnknown: true // Nettoie les champs non définis dans le schéma
    });

    if (jsonError) {
      console.log(jsonError.details);
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ 
        message: jsonError.details.map(err => err.message), 
      });
    }

    // 3. Valider les métadonnées (Statut uniquement)
    const entryMetaSchema = Joi.object({
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').default('DRAFT')
    });

    const { error: metaError, value: validatedMeta } = entryMetaSchema.validate({ status });
    if (metaError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ 
        message: "Statut invalide", 
        errors: metaError.details 
      });
    }

    // 4. Préparer les données pour le controller
    req.body.data_json = validatedJson;
    req.body.status = validatedMeta.status;
    req.body.contentTypeId = contentType.id; 
    
    next();
  } catch (err) {
    console.error("Erreur Middleware Validation:", err);
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: "Erreur lors de la validation dynamique." });
  }
};

export { validateDynamicContent };