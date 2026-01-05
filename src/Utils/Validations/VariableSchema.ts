import Joi from "joi";

const variableCreateSchema = Joi.object({
    name: Joi.string().min(1).required(),
    value: Joi.string().required(),
    collectionId: Joi.number().integer().required()
});

const variableUpdateSchema = Joi.object({
    name: Joi.string().min(1).optional(),
    value: Joi.string().optional()
}).min(1);

const deleteMultipleSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer()).min(1).required()
});

export {
    variableCreateSchema,
    variableUpdateSchema,
    deleteMultipleSchema
}