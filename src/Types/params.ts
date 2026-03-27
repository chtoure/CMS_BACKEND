
// Definition des Sources
enum ValueSource {
  STATIC = 'static',
  IMAGE = 'image',
  CONTENUS = 'contenus',
  PARENT = 'parent'
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
  value: string | number;
}



// Partie Source : Image
interface IImageField {
  source: ValueSource.IMAGE;
  src: string;
  id?: number;
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

// Partie Source : Parent
interface IParentField {
  source: ValueSource.PARENT;
  parentParamName: string;
  parentKey?: string;
  targetType?: ValueSource.STATIC | ValueSource.IMAGE;
}

// Definition Interface BlockField
type IPropsSchemaField =
    | IStaticField
    | IImageField
    | IContenusField
    | IParentField;


// Definition des PropsSchemaField
interface IComponentParams {
  name: string;
  label: string;
  type: IPropsSchemaField;
  required: boolean;
  // config?: Record<string, unknown>;

}


export {
    ValueSource,
    type ITaxonomyFilter,
    type IStaticField,
    type IImageField,
    type IContenusField,
    type IParentField,
    type IPropsSchemaField,
    type IComponentParams,
    type IContenusQuery
}
