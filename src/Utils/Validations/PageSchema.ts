
import Joi from "joi";



const registerPageSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
})

const updatePageSchema = Joi.object({
    title: Joi.string().optional(),
    slug: Joi.string().optional(),
})

export {
    registerPageSchema,
    updatePageSchema
}
