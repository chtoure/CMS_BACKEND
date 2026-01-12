import Joi from 'joi';
import { FieldType, type IFieldDefinition } from '../../Types/InputField.ts';

export const buildJoiSchema = (fields: IFieldDefinition[]): Joi.ObjectSchema => {
  const schemaDefinition: Record<string, Joi.Schema> = {};

  fields.forEach((field) => {
    let validator: Joi.Schema;

    switch (field.type) {
      case FieldType.TEXT: {
        let s = Joi.string();
        if (field.minLength) s = s.min(field.minLength);
        if (field.maxLength) s = s.max(field.maxLength);
        if (field.pattern) s = s.regex(new RegExp(field.pattern));
        validator = s;
        break;
      }

      case FieldType.NUMBER: {
        let n = Joi.number();
        if (field.min !== undefined) n = n.min(field.min);
        if (field.max !== undefined) n = n.max(field.max);
        // En Joi, l'équivalent de "step" est "multiple"
        if (field.step) n = n.multiple(field.step);
        validator = n;
        break;
      }

      case FieldType.RICH_TEXT: {
        // Le texte enrichi est validé comme une chaîne de caractères (HTML/JSON)
        validator = Joi.string();
        break;
      }

      case FieldType.BOOLEAN: {
        validator = Joi.boolean().default(field.defaultValue ?? false);
        break;
      }

      case FieldType.SELECT: {
        const allowedValues = field.options.map(opt => opt.value);
        validator = field.multiple 
          ? Joi.array().items(Joi.valid(...allowedValues)) 
          : Joi.valid(...allowedValues);
        break;
      }

      case FieldType.MEDIA: {
        // Validation de l'objet média provenant de ton module
        const mediaSchema = Joi.object({
          id: Joi.number().required(),
          url: Joi.string().uri().optional(),
          mime_type: Joi.string().optional()
        }).unknown(true);

        validator = field.multiple ? Joi.array().items(mediaSchema) : mediaSchema;
        break;
      }

      case FieldType.TAXONOMY: {
        // Validation des IDs de taxonomies (nombres)
        validator = field.multiple 
          ? Joi.array().items(Joi.number()) 
          : Joi.number();
        break;
      }

      default: {
        validator = Joi.any();
        break;
      }
    }

    // Gestion de la contrainte "requis"
    if (field.required) {
      validator = validator.required();
    } else {
      // Autorise les valeurs vides pour les champs optionnels (important pour le web)
      validator = validator.optional().allow(null, '');
    }

    schemaDefinition[field.name] = validator;
  });

  return Joi.object(schemaDefinition);
};