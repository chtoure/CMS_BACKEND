import type { IComponentParams } from "./params.ts";
import type { AllStyles, BaseStyles, ContainerStyles, InteractiveStyles, StaticStyles } from "./style.ts";

// Actions (Discriminated Unions)
type NavigateAction = { action: 'NAVIGATE_TO'; action_params: { url: string } };
type AlertAction = { action: 'SHOW_ALERT'; action_params: { message: string } };
type ModalAction = { action: 'OPEN_MODAL'; action_params: { modalId: string } };
type CliquableAction = NavigateAction | AlertAction | ModalAction;

// Familles et Capacités
type ComponentFamily = 'static' | 'interactive' | 'container' | 'input';

const FAMILY_CAPABILITIES: Record<ComponentFamily, { canHaveChildren: boolean }> = {
  static: { canHaveChildren: false },
  interactive: { canHaveChildren: false },
  container: { canHaveChildren: true }, 
  input: { canHaveChildren: false },
};

const ACTIONS_BY_FAMILY: Record<ComponentFamily, CliquableAction['action'][]> = {
  static: [],
  interactive: ['NAVIGATE_TO', 'SHOW_ALERT', 'OPEN_MODAL'],
  container: ['OPEN_MODAL'],
  input: ['SHOW_ALERT'],
};

// Support Responsif

type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: JsonValue } 
  | JsonValue[];


interface ComponentProps<T = BaseStyles> {
  styles?: T;
  params?: IComponentParams[];
  data?: Record<string, unknown>;
  children?: AnyComponentInstance[];
}


interface Component <T = BaseStyles> {
  name: string;
  tag: string;
  icon: string;
  family: ComponentFamily;
  supportedActions: CliquableAction['action'][];
  defaultProps:  ComponentProps<T>;
}



type AnyComponent = 
  | Component<ContainerStyles>
  | Component<StaticStyles>
  | Component<InteractiveStyles>
  | Component<BaseStyles>;



interface AnyComponentInstance extends Omit<Component<AllStyles>, 'defaultProps'> {
  id: string;
  styles: AllStyles;
  params: IComponentParams[]
  data: Record<string, unknown>;
  children: AnyComponentInstance[]; // <--- C'est ici que la magie opère !
}

export type {
  NavigateAction,
  AlertAction,
  ModalAction,
  CliquableAction,
  ComponentFamily,
  JsonValue,
  Component,
  AnyComponent,
  AnyComponentInstance,
  ComponentProps
}

export {
  FAMILY_CAPABILITIES,
  ACTIONS_BY_FAMILY,
}










// import type { CliquableAction, ComponentFamily, IComponentPropsType } from "./PropsBuilder.ts";


// interface IComponent {
//   id: number;
//   name: string;
//   tag: string;
//   icon: string;
//   family: ComponentFamily;
//   supportedActions: CliquableAction['action'][];
//   default_props: IComponentPropsType;

//   createdAt: Date;
//   updatedAt: Date;
// }



// interface IRegisterComponent {
//     name: string;
//     tag: string;
//     icon: string;
//     family: ComponentFamily;
//     supportedActions: CliquableAction['action'][];
//     default_props: IComponentPropsType;
// }



// interface IUpdateComponent {
//     name?: string;
//     tag?: string;
//     icon?: string;
//     family?: ComponentFamily;
//     supportedActions?: CliquableAction['action'][];
//     default_props?: IComponentPropsType;
// }



// export type {
//   IComponent,
//   IRegisterComponent,
//   IUpdateComponent
// }