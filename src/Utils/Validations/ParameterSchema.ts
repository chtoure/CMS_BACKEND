import Joi from "joi";

const parameterSchema = Joi.object({
    entity_name: Joi.string().required().max(100).messages({
        'string.base': "Le nom de l'entité doit être une chaîne de caractères.",
        'string.empty': "Le nom de l'entité ne peut pas être vide.",
        'string.max': "Le nom de l'entité ne doit pas dépasser 100 caractères.",
        'any.required': "Le nom de l'entité est requis."
    }),

    title: Joi.string().required().max(255).messages({
        'string.base': "Le titre doit être une chaîne de caractères.",
        'string.empty': "Le titre ne peut pas être vide.",
        'string.max': "Le titre ne doit pas dépasser 255 caractères.",
        'any.required': "Le titre du site est requis."
    }),

    logo: Joi.string().required().messages({
        'string.base': "Le chemin du logo doit être une chaîne de caractères.",
        'string.empty': "Le logo est requis.",
        'any.required': "Le logo est requis."
    }),

    description: Joi.string().allow(null, '').max(500).messages({
        'string.max': "La description ne doit pas dépasser 500 caractères."
    })
});

export { parameterSchema };