
import Joi from "joi";

// Validation de Permission
export const permissionSchema = Joi.object({
    name: Joi.string().min(3).lowercase().required(),
    description:Joi.string().min(3).optional()
})
