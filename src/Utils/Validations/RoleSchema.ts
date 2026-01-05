
import Joi from "joi";


// Validation de Role
export const roleSchema = Joi.object({
    name: Joi.string().min(3).required(),
    // Un tableau qui contient des chaînes de caractères
    permissionIds: Joi.array().items(Joi.number())
});



// Validation de la mise à jour de Role
export const roleUpdateSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    // Un tableau qui contient des numbers
    permissionIds: Joi.array().items(Joi.number()).optional()
});