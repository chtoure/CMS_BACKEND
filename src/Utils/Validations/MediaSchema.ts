import Joi from "joi";

const mediaScheme = Joi.object({
    file_path: Joi.string().required(),
    type: Joi.string().valid('image', 'video').required(),
    alt: Joi.string().allow(null, '')
});

export { mediaScheme };