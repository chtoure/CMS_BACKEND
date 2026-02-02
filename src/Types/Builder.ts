import type { FieldType, IPropsConfigDefinition } from "./InputField.ts";

// Definition des Sources
enum ValueSource {
  STATIC = 'static',     
  VARIABLE = 'variable', 
  CONTENUS = 'contenus'  
}

// Partie Taxonomy
interface ITaxonomyFilter {
  taxonomyId: number;
  termIds: number[];
  operator: 'AND' | 'OR';
}


// Partie Source : Static
interface IStaticField {
  source: ValueSource.STATIC;
  value: any; 
}


// Partie Source : Variable
interface IVariableField {
  source: ValueSource.VARIABLE;
  variableId: number; 
}

// Partie Source : Contenus
interface IContenusSingle {
    mode: 'single';
    entryId: number;
    mappingField?: string;
}

interface IContenusQuery {
    mode: 'query';
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    taxonomyFilters?: ITaxonomyFilter[];
}

interface IContenusField {
  source: ValueSource.CONTENUS;
  contentTypeId: number;
  config: 
    | IContenusSingle
    | IContenusQuery;

}


// Definition des PropsSchemaField
interface IPropsSchemaField {
  name: string;      
  label: string;     
  type: FieldType;   
  required: boolean;
  config: Omit<IPropsConfigDefinition, 'type'>;

}


// Definition Interface PropsSchema
interface IPropsSchema {
  fields: IPropsSchemaField[];
}


// Definition Interface BlockField
type IBlockFieldDefinition = 
    | IStaticField 
    | IVariableField 
    | IContenusField;


export {
    ValueSource,
    type ITaxonomyFilter,
    type IStaticField,
    type IVariableField,
    type IContenusField,
    type IPropsSchemaField,
    type IPropsSchema,
    type IBlockFieldDefinition
}