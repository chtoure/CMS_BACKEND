import type { AnyComponent, ComponentProps } from "./component.ts";
import type { BaseStyles } from "./style.ts";


interface BlocTemplate <T = BaseStyles> {
  id: number;
  name: string;        
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId?: number;
  children?: BlocTemplate<T>[];
  props: ComponentProps<T>;
  createdAt: Date;
  updatedAt: Date;
  component?: AnyComponent;
  archive: boolean;
  archivedAt: Date | null;
 
}



interface RegisterBlocTemplate {
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId?: number;
}



interface UpdateBlocTemplate <T = BaseStyles>{
  name?: string;        
  componentId?: number;
  order?: number;
  parentId?: number;
  sectionId?: number;
  props?: ComponentProps<T>;
}


// Interface pour construire l'arbre des blocTemplates 
// (Qui s'affiche dans le Builder)
// interface BlocTemplate <T = BaseStyles> {
//     id: number;
//     name: string;
//     order: number;
//     tag: string;
//     defaultProps: ComponentProps<T>;
//     children: BlocTemplate<T>[];
// }



export type {
    UpdateBlocTemplate,
    BlocTemplate,
    RegisterBlocTemplate
};