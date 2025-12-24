import Joi from "joi";

const mediaSchema = Joi.object({
    alt: Joi.string().allow(null, '').max(255).messages({
        'string.max': "Le texte alternatif ne doit pas dépasser 255 caractères."
    }),
    type: Joi.string().optional(), 
});

const mediaDeleteSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer().positive()).min(1).optional().messages({
        'array.base': "Le champ 'ids' doit être un tableau de nombres.",
        'array.min': "Le tableau 'ids' doit contenir au moins un élément."
    })
});


const imageEditSchema = Joi.object({
    resize: Joi.object({
        width: Joi.number().integer().min(1).max(3840).optional(),
        height: Joi.number().integer().min(1).max(2160).optional(),
    }).optional(),

    grayscale: Joi.boolean().optional(),
    sharpen: Joi.boolean().optional(),
    rotate: Joi.boolean().optional(),

    blur: Joi.number().min(0.3).max(100).optional(),

    tint: Joi.object({
        r: Joi.number().integer().min(0).max(255).required(),
        g: Joi.number().integer().min(0).max(255).required(),
        b: Joi.number().integer().min(0).max(255).required(),
    }).optional()
}).min(1);


export { mediaSchema, mediaDeleteSchema, imageEditSchema};
