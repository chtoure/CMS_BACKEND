import type { IComponent } from "./component.ts";
import type { IComponentPropsType } from "./PropsBuilder.ts";


interface IBlocTemplate {
  id: number;
  name: string;        
  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId: number;

  default_json: IComponentPropsType;
  createdAt: Date;
  updatedAt: Date;
  component?: IComponent;
 
}



interface IRegisterBlocTemplate {

  componentId: number;
  order: number;
  parentId?: number | null;
  sectionId: number;

}



interface IUpdateBlocTemplate {
  name?: string;        
  componentId?: number;
  order?: number;
  parentId?: number;
  sectionId?: number;

  default_json?: IComponentPropsType;
}


// Interface pour construire l'arbre des blocTemplates 
// (Qui s'affiche dans le Builder)
interface IGetBlocTemplates {
    id: number;
    name: string;
    order: number;
    tag: string;
    defaultProps: IComponentPropsType;
    children: IGetBlocTemplates[];
}



export type {
    IBlocTemplate,
    IRegisterBlocTemplate,
    IUpdateBlocTemplate,
    IGetBlocTemplates
};