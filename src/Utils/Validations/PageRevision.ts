
import Joi from "joi";



const updatePageRevisionSchema = Joi.object({
    pageId: Joi.number().optional(),
    status: Joi.string().optional(),
    version: Joi.number().optional(),
})

export {
    updatePageRevisionSchema
}