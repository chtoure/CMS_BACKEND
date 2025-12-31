import Joi from "joi";

const collectionSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    type: Joi.string().valid('COLOR', 'NUMBER', 'STRING', 'BOOLEAN').required()
});

export {
    collectionSchema
}
