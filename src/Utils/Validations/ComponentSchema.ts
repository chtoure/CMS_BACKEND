
import Joi from "joi";
import type { IComponentPropsType } from "../../Types/PropsBuilder.ts";


// Permet de valider soit une valeur simple, soit l'objet responsive
const responsiveProp = (type: Joi.Schema) => Joi.alternatives().try(
    type,
    Joi.object({
        default: type.required(),
        sm: type,
        md: type,
        lg: type
    })
);

// Schéma pour les styles communs
const commonStylesSchema = Joi.object({
    marginTop: responsiveProp(Joi.alternatives().try(Joi.number(), Joi.string())),
    marginBottom: responsiveProp(Joi.alternatives().try(Joi.number(), Joi.string())),
    padding: responsiveProp(Joi.alternatives().try(Joi.number(), Joi.string())),
    bg: responsiveProp(Joi.string()),
    rounded: responsiveProp(Joi.string()),
    shadow: responsiveProp(Joi.string()),
    opacity: responsiveProp(Joi.number()),
    display: responsiveProp(Joi.string().valid('hidden', 'block', 'flex', 'grid'))
});



const componentPropsSchema = Joi.object({
    styles: commonStylesSchema.keys({
        // Container
        columns: responsiveProp(Joi.number()),
        gap: responsiveProp(Joi.number()),
        direction: responsiveProp(Joi.string().valid('horizontal', 'vertical')),
        justify: responsiveProp(Joi.string().valid('start', 'center', 'end', 'between')),
        align: responsiveProp(Joi.string().valid('start', 'center', 'end', 'between')),
        border: responsiveProp(Joi.string()),
        // Static
        fontSize: responsiveProp(Joi.string()),
        fontWeight: responsiveProp(Joi.string()),
        textAlign: responsiveProp(Joi.string().valid('left', 'center', 'right')),
        textColor: responsiveProp(Joi.string()),
        // Interactive
        variant: Joi.string(),
        size: Joi.string()
    }),
    data: Joi.object().unknown(true)
});

const registerComponentSchema = Joi.object({
    name: Joi.string().required(),
    tag: Joi.string().required(),
    icon: Joi.string().required(),
    family: Joi.string().valid('static', 'interactive', 'container', 'input').required(),
    supportedActions: Joi.array()
        .items(Joi.string().valid('NAVIGATE_TO', 'SHOW_ALERT', 'OPEN_MODAL'))
        .required(),
    default_props: componentPropsSchema.required()
});

// Schéma pour le tableau (Register)
const ComponentListSchema = Joi.array().items(registerComponentSchema);


export {
    registerComponentSchema,
    ComponentListSchema
}