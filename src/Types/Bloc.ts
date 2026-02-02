import type { IBlockFieldDefinition } from "./Builder.ts";


interface IBloc {
  id: number;          
  templateId: number;  
  pageRevisionId: number; 
  
  parentId?: string | null; 
  order: number;            

  block_json: {
    metadata?: {
      adminLabel?: string;
    };
    content: Record<string, IBlockFieldDefinition>;
    styles: Record<string, IBlockFieldDefinition>;
  };
}