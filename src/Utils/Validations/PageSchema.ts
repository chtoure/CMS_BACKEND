
import Joi from "joi";



const registerPageSchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    
})

const updatePageSchema = Joi.object({
    name: Joi.string().optional(),
    slug: Joi.string().optional(),
})

export {
    registerPageSchema,
    updatePageSchema
}
