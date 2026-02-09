import type { IBlockFieldDefinition, IPropsSchema } from "./Builder.ts";


interface IComponent {
  id: number;
  name: string;
  tag: string;
  description: string | null;
  icon: string | null;
  
  // default_props: IPropsSchema;
  default_props: {
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
  createdAt: Date;
  updatedAt: Date;
}



interface IRegisterComponent {
    name: string;
    tag: string;
    description: string | null;
    icon: string | null;
    default_props: {
        content: Record<string, IBlockFieldDefinition>;
        styles: Record<string, IBlockFieldDefinition>;
    };
}



interface IUpdateComponent {
    name?: string;
    tag?: string;
    description?: string | null;
    icon?: string | null;
    default_props?: {
        content: Record<string, IBlockFieldDefinition>;
        styles: Record<string, IBlockFieldDefinition>;
    };
}



export type {
  IComponent,
  IRegisterComponent,
  IUpdateComponent
}