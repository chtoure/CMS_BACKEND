import type { IBlockFieldDefinition } from "./Builder.ts";


interface ISection {
  id: number;          
  pageRevisionId: number; 
  order: number;

  block_json: {
    metadata?: {
      adminLabel?: string;
    };
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}



interface IRegisterSection {
  pageRevisionId: number;
  order: number;
  block_json: {
    metadata?: {
      adminLabel?: string;
    };
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}


interface IUpdateSection {
  pageRevisionId?: number;
  order?: number;
  block_json?: {
    metadata?: {
      adminLabel?: string;
    };
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}


export type {
    ISection,
    IRegisterSection,
    IUpdateSection
}
