enum FieldType {
  TEXT = 'text',
  RICH_TEXT = 'richtext',
  NUMBER = 'number',
  MEDIA = 'media',
  TAXONOMY = 'taxonomy',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  RELATION = 'relation'
}


interface ITextConfig {
  type: FieldType.TEXT;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string; 
}


interface INumberConfig {
  type: FieldType.NUMBER;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
}


interface IMediaConfig {
  type: FieldType.MEDIA;
  required: boolean;
  allowedTypes: ('image' | 'video' | null)[];
  multiple: boolean;
}


interface ITaxonomyConfig {
  type: FieldType.TAXONOMY;
  taxonomy_slug: string;
  multiple: boolean;
  renderType: 'combobox' | 'badges' | 'checkbox';
}


// interface ISelectOption {
//   label: string;
//   value: string | number;
// }


interface ISelectConfig {
  type: FieldType.SELECT;
  options: (string | number)[];
  multiple: boolean;
}


interface IBaseField {
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
  description?: string;
}


interface IBooleanConfig {
  type: FieldType.BOOLEAN;
  required: boolean;
  defaultValue?: boolean;
}


interface IRichTextConfig {
  type: FieldType.RICH_TEXT;
  required: boolean;
  toolbar?: 'minimal' | 'full';
}

interface IRelationConfig {
  type: FieldType.RELATION;
  contentTypeId: number; 
  multiple: boolean;             
  required: boolean;
}


type IFieldDefinition =
  | (IBaseField & ITextConfig)
  | (IBaseField & INumberConfig)
  | (IBaseField & IMediaConfig)
  | (IBaseField & ITaxonomyConfig)
  | (IBaseField & ISelectConfig)
  | (IBaseField & IBooleanConfig)
  | (IBaseField & IRichTextConfig)
  | (IBaseField & IRelationConfig);

export {
  FieldType,
  type IFieldDefinition,
  type IBaseField,
  type ITextConfig,
  type INumberConfig,
  type IMediaConfig,
  type ITaxonomyConfig,
  type ISelectConfig,
  type IBooleanConfig,
  type IRichTextConfig,
  type IRelationConfig
}