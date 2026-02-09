import type { IPropsSchema, IBlockFieldDefinition } from "./Builder.ts";


interface IBlocTemplate {
  id: number;
  name: string;        
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId: number;

  props_schema: IPropsSchema;
  default_json: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
  createdAt: Date;
  updatedAt: Date;
 
}



interface IRegisterBlocTemplate {
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId: number;

  props_schema: IPropsSchema;
  default_json: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}



interface IUpdateBlocTemplate {
  name?: string;        
  componentId?: number;
  order?: number;
  parentId?: number | null;
  sectionId?: number | null;

  props_schema?: IPropsSchema;
  default_json?: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}




export type {
    IBlocTemplate,
    IRegisterBlocTemplate,
    IUpdateBlocTemplate
};