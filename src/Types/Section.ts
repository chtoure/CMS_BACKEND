import type { BlocTemplate } from "./BlocTemplate.ts";
import type { BaseStyles, ResponsiveProp } from "./style.ts";


export interface sectionStyle {
  padding?: ResponsiveProp<number | string>;
  bg?: ResponsiveProp<string>;
  opacity?: ResponsiveProp<number>;
  display?: ResponsiveProp<'hidden' | 'block' | 'flex' | 'grid'>;
  columns?: ResponsiveProp<number>;
  gap?: ResponsiveProp<number>;
  direction?: ResponsiveProp<'horizontal' | 'vertical'>;
  justify?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
  align?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
  borderWidth?: ResponsiveProp<number | string>;
  borderColor?: ResponsiveProp<string>;
  borderStyle?: ResponsiveProp<'solid' | 'dashed' | 'dotted' | 'double' | 'hidden'>;

}

interface SectionProps {
  styles?: sectionStyle;
}


interface Section {
  id: number;          
  pageRevisionId: number; 
  order: number;
  blocTemplates?: BlocTemplate[];
  block_json: SectionProps;
  createdAt: Date;
  updatedAt: Date;
}



interface RegisterSection {
  pageRevisionId: number;
  order: number;
  block_json?: SectionProps;
}


interface UpdateSection {
  pageRevisionId?: number;
  order?: number;
  block_json?: SectionProps;
}



interface PageRender {
    id: number;
    pageRevisionId: number;
    block_json: SectionProps;
    components: BlocTemplate[];
    createdAt: Date;
    updatedAt: Date;
}


export type {
    Section,
    RegisterSection,
    UpdateSection,
    PageRender,
    SectionProps
}
