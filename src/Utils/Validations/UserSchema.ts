import Joi from "joi";

// Validation Du User
export const UserSchema = Joi.object({
    full_name: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password_hash: Joi.string().min(3).required(),
    refreshToken: Joi.string().token(),
    role_id: Joi.number()
})