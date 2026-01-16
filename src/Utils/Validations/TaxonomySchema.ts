import Joi from "joi";

export const taxonomySchema = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string().min(3).required(),
  description: Joi.string().min(3).allow(null, '').optional(),
  terms: Joi.array().items(Joi.string()).optional(),
});

export const taxonomyUpdateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  slug: Joi.string().min(3).optional(),
  description: Joi.string().min(3).allow(null, '').optional(),
  terms: Joi.array().items(Joi.string()).optional(),
});

export const taxonomyTermSchema = Joi.object({
  name: Joi.string().min(1).required(),
  slug: Joi.string().min(1).required(),
  taxonomyId: Joi.number().required(),
});

export const taxonomyTermUpdateSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  slug: Joi.string().min(1).optional(),
});
