import type { CliquableAction, ComponentFamily, IComponentPropsType } from "./PropsBuilder.ts";


interface IComponent {
  id: number;
  name: string;
  tag: string;
  icon: string;
  family: ComponentFamily;
  supportedActions: CliquableAction['action'][];
  default_props: IComponentPropsType;

  createdAt: Date;
  updatedAt: Date;
}




interface IRegisterComponent {
    name: string;
    tag: string;
    icon: string;
    family: ComponentFamily;
    supportedActions: CliquableAction['action'][];
    default_props: IComponentPropsType;
}



interface IUpdateComponent {
    name?: string;
    tag?: string;
    icon?: string;
    family?: ComponentFamily;
    supportedActions?: CliquableAction['action'][];
    default_props?: IComponentPropsType;
}



export type {
  IComponent,
  IRegisterComponent,
  IUpdateComponent
}