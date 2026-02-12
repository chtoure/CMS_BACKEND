import type { IGetBlocTemplates } from "./BlocTemplate.ts";
import type { IComponentPropsType } from "./PropsBuilder.ts";


interface ISection {
  id: number;          
  pageRevisionId: number; 
  order: number;
  block_json: IComponentPropsType;
  createdAt: Date;
  updatedAt: Date;
}



interface IRegisterSection {
  pageRevisionId: number;
  order: number;
  block_json?: IComponentPropsType;
}


interface IUpdateSection {
  pageRevisionId?: number;
  order?: number;
  block_json?: IComponentPropsType;
}



interface IPageRender {
    id: number;
    pageRevisionId: number;
    order: number;
    block_json: IComponentPropsType;
    components: IGetBlocTemplates[];
    createdAt: Date;
    updatedAt: Date;
}


export type {
    ISection,
    IRegisterSection,
    IUpdateSection,
    IPageRender
}
