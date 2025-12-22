import Joi from "joi";

// Validation Du User : Register
export const userRegisterSchema = Joi.object({
    full_name: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string()
})

// Validation Du User : Login
export const userLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
})
