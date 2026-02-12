
import Joi from "joi";
import { componentPropsSchema } from "./ComponentSchema.ts";


const registerSectionSchema = Joi.object({
    pageRevisionId: Joi.number().required(),
    order: Joi.number().required(),
    block_json: componentPropsSchema.optional(),
});


const updateSectionSchema = Joi.object({
    pageRevisionId: Joi.number().optional(),
    order: Joi.number().optional(),
    block_json: componentPropsSchema.optional(),
});


export {
    registerSectionSchema,
    updateSectionSchema
}