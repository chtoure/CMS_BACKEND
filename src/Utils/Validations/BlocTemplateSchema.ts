
import Joi from "joi";
import { componentPropsSchema } from "./ComponentSchema.ts";


const registerBlocTemplateSchema = Joi.object({
    componentId: Joi.number().required(),
    sectionId: Joi.number().required(),
    order: Joi.number().required(),
    parentId: Joi.number().optional(),
    default_json: componentPropsSchema.optional(),
});


const updateBlocTemplateSchema = Joi.object({
    name: Joi.string().optional(),
    componentId: Joi.number().optional(),
    sectionId: Joi.number().optional(),
    order: Joi.number().optional(),
    parentId: Joi.number().optional(),
    default_json: componentPropsSchema.optional(),
});


export {
    registerBlocTemplateSchema,
    updateBlocTemplateSchema
}