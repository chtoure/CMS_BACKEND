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
    geometry: Joi.object({
        rotation: Joi.number().integer().min(0).max(359).default(0),
        flipH: Joi.boolean().default(false),
        flipV: Joi.boolean().default(false),
        crop: Joi.object({
            x: Joi.number().integer().min(0).required(),
            y: Joi.number().integer().min(0).required(),
            width: Joi.number().integer().min(1).required(),
            height: Joi.number().integer().min(1).required(),
        }).optional()
    }).optional(),

    adjustments: Joi.object({
        brightness: Joi.number().min(0).max(2).default(1),
        contrast: Joi.number().min(0).max(2).default(1),
        saturation: Joi.number().min(0).max(2).default(1),
        blur: Joi.number().min(0).max(100).default(0),
        grayscale: Joi.boolean().default(false)
    }).optional(),

    bgRemoved: Joi.boolean().optional()
}).min(1);

export { mediaSchema, mediaDeleteSchema, imageEditSchema};
