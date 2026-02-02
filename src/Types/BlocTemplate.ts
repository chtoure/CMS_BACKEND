import type { IPropsSchema, IBlockFieldDefinition } from "./Builder.ts";


interface IBlocTemplate {
  id: number;
  name: string;         
  component: string;   
  props_schema: IPropsSchema;
  default_json: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}

export type {
    IBlocTemplate,
};