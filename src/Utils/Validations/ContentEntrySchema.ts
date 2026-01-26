import Joi from 'joi';
import { FieldType, type IFieldDefinition, type INumberConfig, type IRelationConfig, type ISelectConfig, type ITaxonomyConfig, type ITextConfig } from '../../Types/InputField.ts';

const buildJoiSchema = (fields: IFieldDefinition[]) => {
  const schemaDefinition: Record<string, Joi.Schema> = {};

  fields.forEach((field) => {
    let validator: Joi.Schema;

    switch (field.type) {
      case FieldType.TEXT: {
        const f = field as ITextConfig;
        let s = Joi.string().trim(); // Ajout de .trim() pour nettoyer les espaces
        if (f.minLength) s = s.min(f.minLength);
        if (f.maxLength) s = s.max(f.maxLength);
        if (f.pattern) s = s.pattern(new RegExp(f.pattern));
        validator = s;
        break;
      }

      case FieldType.NUMBER: {
        const f = field as INumberConfig;
        let n = Joi.number();
        if (f.min !== undefined) n = n.min(f.min).messages({
          'number.min': `${field.label} ne peut pas être inférieur à ${f.min}`
        });
        if (f.max !== undefined) n = n.max(f.max).messages({
          'number.max': `${field.label} ne peut pas dépasser ${f.max}`
        });
        // Note: step n'est pas nativement supporté pour la division par Joi, precision suffit
        validator = n;
        break;
      }

      case FieldType.SELECT: {
        const f = field as ISelectConfig;
        const allowedValues = f.options;
        const base = Joi.valid(...allowedValues).messages({
          'any.only': `${field.label} doit être l'une des valeurs suivantes : ${allowedValues.join(', ')}`
        });
        validator = f.multiple 
          ? Joi.array().items(base).unique().messages({
            'array.includesOneOf': `${field.label} doit contenir uniquement des valeurs valides`
          }) // unique() évite les doublons dans le tableau
          : base;
        break;
      }

      case FieldType.TAXONOMY: {
        const f = field as ITaxonomyConfig;
        const taxId = Joi.number().integer().positive().messages({
          'number.base': `${field.label} doit être un nombre`,
          'number.integer': `${field.label} doit être un nombre entier`,
          'number.positive': `${field.label} doit être un nombre positif`
        });
        validator = f.multiple ? Joi.array().items(taxId).unique().messages({
          'array.includesOneOf': `${field.label} doit contenir uniquement des nombres valides`,
          'array.unique': `${field.label} ne doit pas contenir de doublons`
        }) : taxId;
        break;
      }

      case FieldType.RELATION: {
        const f = field as IRelationConfig;
        // Accepter ID numérique ou String (UUID)
        const refId = Joi.alternatives().try(Joi.number(), Joi.string()).messages({
          'alternatives.types': `${field.label} doit être un nombre ou une chaîne de caractères`
        });
        validator = f.multiple ? Joi.array().items(refId).unique().messages({
          'array.includesOneOf': `${field.label} doit contenir uniquement des nombres ou des chaînes de caractères valides`,
          'array.unique': `${field.label} ne doit pas contenir de doublons`
        }) : refId;
        break;
      }

      case FieldType.MEDIA: {
        // En général, on stocke l'ID ou l'URL du média
        const mediaVal = Joi.alternatives().try(Joi.number(), Joi.string()).messages({
          'alternatives.types': `${field.label} doit être un nombre ou une chaîne de caractères`
        });
        validator = (field as any).multiple ? Joi.array().items(mediaVal).unique().messages({
          'array.includesOneOf': `${field.label} doit contenir uniquement des nombres ou des chaînes de caractères valides`,
          'array.unique': `${field.label} ne doit pas contenir de doublons`
        }) : mediaVal;
        break;
      }

      case FieldType.BOOLEAN:
        validator = Joi.boolean().messages({
          'boolean.base': `${field.label} doit être un booléen`
        });
        break;

      case FieldType.RICH_TEXT:
        validator = Joi.string().allow('', null).messages({
          'string.base': `${field.label} doit être une chaîne de caractères`
        });
        break;

      default:
        validator = Joi.any();
    }

    // Gestion du Requis / Optionnel
    if (field.required) {
      validator = validator.required().messages({
        'any.required': `${field.label} est obligatoire`,
        'string.empty': `${field.label} ne peut pas être vide`
      });
    } else {
      // .allow('') est important pour les formulaires web qui envoient des chaines vides
      validator = validator.optional().allow(null, '')
    }

    schemaDefinition[field.name] = validator;
  });

  return Joi.object(schemaDefinition);
};

const switchStatusSchema = Joi.object({
    status: Joi.string().valid("PUBLISHED", "DRAFT", "ARCHIVED").required()
})

const toggleArchiveSchema = Joi.object({
    archive: Joi.boolean().required()
})

export {
  switchStatusSchema,
  buildJoiSchema,
  toggleArchiveSchema
};