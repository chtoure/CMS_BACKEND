import type { AnyComponent, ComponentProps } from "./component.ts";
import type { BaseStyles } from "./style.ts";


interface BlocTemplate <T = BaseStyles> {
  id: number;
  name: string;        
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId?: number | null;
  children?: BlocTemplate<T>[];
  props: ComponentProps<T>;
  is_custom: boolean;
  createdAt: Date;
  updatedAt: Date;
  component?: AnyComponent;
  archive: boolean;
  archivedAt: Date | null;
  modelId?: number | null;
  model?: BlocTemplate;
  customBlocTemplates?: BlocTemplate[]
}



interface RegisterBlocTemplate {
  componentId: number;
  order: number;
  is_custom: boolean;
  parentId?: number | null;
  sectionId?: number | null;
  modelId?: number | null;
}



interface UpdateBlocTemplate <T = BaseStyles>{
  name?: string;        
  componentId?: number;
  order?: number;
  is_custom: boolean;
  parentId?: number | null;
  sectionId?: number | null;
  props?: ComponentProps<T>;
}



export type {
    UpdateBlocTemplate,
    BlocTemplate,
    RegisterBlocTemplate
};