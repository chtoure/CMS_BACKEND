import Joi from "joi";
import { TypesMedia } from "../../Types/InputField.ts";

// Schéma pour les options des Select
const selectOptionSchema = Joi.alternatives().try(Joi.string(), Joi.number());

// Schéma individuel pour chaque définition de champ
const fieldDefinitionSchema = Joi.object({
  // Propriétés communes (IBaseField)
  name: Joi.string().required().lowercase().trim(),
  label: Joi.string().required().allow(''),
  required: Joi.boolean().required(),
  placeholder: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  
  // Discriminant
  type: Joi.string().valid(
    'text', 'richtext', 'number', 'media', 
    'taxonomy', 'boolean', 'select', 'relation'
  ).required(),

  // Validation spécifique selon le type (Configs)
  minLength: Joi.number().optional(),
  maxLength: Joi.number().optional(),
  pattern: Joi.string().optional(),
  min: Joi.number().optional(),
  max: Joi.number().optional(),
  step: Joi.number().optional(),
  maxSize: Joi.number().optional(),
  allowedTypes: Joi.array().items(Joi.string().valid(...Object.values(TypesMedia)).allow(null)).optional(),
  multiple: Joi.boolean().optional(),
  taxonomy_slug: Joi.string().when('type', { is: 'taxonomy', then: Joi.required() }),
  renderType: Joi.string().valid('combobox', 'badges', 'checkbox').optional(),
  options: Joi.array().items(selectOptionSchema).when('type', { is: 'select', then: Joi.required() }).messages({'array.base': 'Les options doivent être un tableau'}),
  defaultValue: Joi.any().optional(),
  toolbar: Joi.string().valid('minimal', 'full').optional(),
  contentTypeId: Joi.number().when('type', { is: 'relation', then: Joi.required() }).invalid(0).messages({'number.invalid': 'Le contentTypeId ne peut pas être 0'}),
});



// Validation principale
export const contentTypeSchema = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string().min(3).required(),
  description: Joi.string().min(3).allow(null, '').optional(),
  archive: Joi.boolean().default(false).optional(),
  // On valide que c'est un tableau de définitions
  fields_schema: Joi.array()
    .items(fieldDefinitionSchema)
    .unique('name')
    .required()
    .messages({
      'array.unique': 'Le nom technique du champ (name) doit être unique.'
    })
});

export const contentTypeUpdateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  slug: Joi.string().min(3).optional(),
  description: Joi.string().min(3).allow(null, '').optional(),
  archive: Joi.boolean().default(false).optional(),
  fields_schema: Joi.array()
    .items(fieldDefinitionSchema)
    .unique('name')
    .optional()
    .messages({
      'array.unique': 'Le nom technique du champ (name) doit être unique.'
    })
});