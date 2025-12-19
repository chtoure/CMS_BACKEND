
import Joi from "joi";


// Validation de Role
export const roleSchema = Joi.object({
    name: Joi.string().min(3).required(),
    // Un tableau qui contient des chaînes de caractères
    permissions: Joi.array().items(Joi.string())
})