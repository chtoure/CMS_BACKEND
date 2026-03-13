import Joi from "joi";
import { ValueSource } from "../../Types/params.ts";

// --- HELPERS ---
const responsiveProp = (type: Joi.Schema) => Joi.alternatives().try(
    type,
    Joi.object({
        default: type.required(),
        sm: type,
        md: type,
        lg: type
    })
);

// --- SCHÉMAS DES SOURCES (IPropsSchemaField) ---
const StaticFieldSchema = Joi.object({
    source: Joi.string().valid(ValueSource.STATIC).required(),
    value: Joi.alternatives().try(Joi.string(), Joi.number()).required()
});

const ImageFieldSchema = Joi.object({
    source: Joi.string().valid(ValueSource.IMAGE).required(),
    src: Joi.string().required(),
    id: Joi.number().optional()
});

const ContenusFieldSchema = Joi.object({
    source: Joi.string().valid(ValueSource.CONTENUS).required(),
    contentTypeId: Joi.number().required(),
    config: Joi.alternatives().try(
        // IContenusSingle
        Joi.object({
            mode: Joi.string().valid('single').required(),
            entryId: Joi.number().required(),
            mappingField: Joi.string().optional()
        }),
        // IContenusQuery
        Joi.object({
            mode: Joi.string().valid('query').required(),
            limit: Joi.number().optional(),
            sortBy: Joi.string().optional(),
            order: Joi.string().valid('asc', 'desc').optional(),
            taxonomyFilters: Joi.array().items(Joi.object({
                taxonomyId: Joi.number().required(),
                termIds: Joi.array().items(Joi.number()).required(),
                operator: Joi.string().valid('AND', 'OR').required()
            })).optional()
        })
    ).required()
});

const ParentFieldSchema = Joi.object({
    source: Joi.string().valid(ValueSource.PARENT).required(),
    parentParamName: Joi.string().required(),
    parentKey: Joi.string().optional(),
    targetType: Joi.string().valid(ValueSource.STATIC, ValueSource.IMAGE).optional()
});

const PropsSchemaField = Joi.alternatives().try(
    StaticFieldSchema,
    ImageFieldSchema,
    ContenusFieldSchema,
    ParentFieldSchema
);

// --- COMPONENT STRUCTURE ---

const ComponentParamsSchema = Joi.object({
    name: Joi.string().required(),
    label: Joi.string().required(),
    type: PropsSchemaField.required(),
    required: Joi.boolean().required()
});

const componentPropsSchema = Joi.object({
    styles: Joi.object().unknown(true), // On garde l'ouverture pour les différents styles types
    params: Joi.array().items(ComponentParamsSchema).optional(),
    data: Joi.object().unknown(true).optional(),
    children: Joi.array().items(Joi.link('...')).optional() // Récursivité si nécessaire
});

const registerComponentSchema = Joi.object({
    name: Joi.string().required(),
    tag: Joi.string().required(),
    icon: Joi.string().required(),
    family: Joi.string().valid('static', 'interactive', 'container', 'input').required(),
    supportedActions: Joi.array()
        .items(Joi.string().valid('NAVIGATE_TO', 'SHOW_ALERT', 'OPEN_MODAL'))
        .required(),
    defaultProps: componentPropsSchema.required()
});

const ComponentListSchema = Joi.array().items(registerComponentSchema);

export {
    registerComponentSchema,
    ComponentListSchema,
    componentPropsSchema
};