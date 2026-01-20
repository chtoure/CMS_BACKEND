import Joi from "joi";

// Validation Du User : Register
export const userRegisterSchema = Joi.object({
    full_name: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8),
    role: Joi.string()
})


// Validation Du User : Login
export const userLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
})





// Validation Du User : Update
export const userUpdateSchema = Joi.object({
    full_name: Joi.string().min(3),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8),
    role: Joi.string()
})


// Validation Du Change Password
export const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required()
})