import type { IBlockFieldDefinition } from "./Builder.ts";


export interface ISection {
  id: number;          
  templateId: number;  
  pageRevisionId: number; 
  order: number;            
  parentId?: string | null; 
  

  block_json: {
    metadata?: {
      adminLabel?: string;
    };
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}