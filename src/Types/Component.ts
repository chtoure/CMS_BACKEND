import type { IBlockFieldDefinition, IPropsSchema } from "./Builder.ts";


export interface IComponent {
  id: number;
  name: string;
  tag: string;
  description: string | null;
  icon: string | null;
  
  default_props: IPropsSchema;
  default_json: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
  createdAt: Date;
  updatedAt: Date;
}