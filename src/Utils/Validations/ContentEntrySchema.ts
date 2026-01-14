import Joi from 'joi';
import { FieldType, type IFieldDefinition } from '../../Types/InputField.ts';

export const buildJoiSchema = (fields: IFieldDefinition[]) => {
  const schemaDefinition: Record<string, Joi.Schema> = {};

  fields.forEach((field) => {
    let validator: Joi.Schema;

    switch (field.type) {
      case FieldType.TEXT:
        let s = Joi.string();
        if (field.minLength) s = s.min(field.minLength);
        if (field.maxLength) s = s.max(field.maxLength);
        if (field.pattern) s = s.pattern(new RegExp(field.pattern));
        validator = s;
        break;

      case FieldType.NUMBER:
        let n = Joi.number();
        if (field.min !== undefined) n = n.min(field.min);
        if (field.max !== undefined) n = n.max(field.max);
        if (field.step) n = n.precision(5);
        validator = n;
        break;

      case FieldType.BOOLEAN:
        validator = Joi.boolean();
        break;

      case FieldType.SELECT:
        const allowedValues = field.options;
        validator = field.multiple 
          ? Joi.array().items(Joi.valid(...allowedValues)) 
          : Joi.valid(...allowedValues);
        break;

      case FieldType.MEDIA:
        const mediaId = Joi.number().integer().positive();
        validator = field.multiple ? Joi.array().items(mediaId) : mediaId;
        break;

      case FieldType.RICH_TEXT:
        validator = Joi.string().allow('');
        break;

      case FieldType.TAXONOMY:
        const taxId = Joi.number().integer().positive();
        validator = field.multiple ? Joi.array().items(taxId) : taxId;
        break;
      case FieldType.RELATION:
        const refId = Joi.alternatives().try(Joi.number(), Joi.string());
        validator = field.multiple ? Joi.array().items(refId) : refId;
        break;

      default:
        validator = Joi.any();
    }

    if (field.required) {
      validator = validator.required();
    } else {
      validator = validator.optional().allow(null);
    }

    schemaDefinition[field.name] = validator;
  });

  return Joi.object(schemaDefinition);
};