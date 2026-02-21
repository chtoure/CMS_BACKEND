
// // Actions (Discriminated Unions)
// type NavigateAction = { action: 'NAVIGATE_TO'; action_params: { url: string } };
// type AlertAction = { action: 'SHOW_ALERT'; action_params: { message: string } };
// type ModalAction = { action: 'OPEN_MODAL'; action_params: { modalId: string } };
// type CliquableAction = NavigateAction | AlertAction | ModalAction;

// // Familles et Capacités
// type ComponentFamily = 'static' | 'interactive' | 'container' | 'input';

// // Support Responsif
// type ResponsiveProp<T = string> = T | {
//   default: T;    
//   sm?: T;        
//   md?: T;        
//   lg?: T;        
// };

// // types/styles.ts

// interface CommonStyles {
//   marginTop?: ResponsiveProp<number | string>;
//   marginBottom?: ResponsiveProp<number | string>;
//   padding?: ResponsiveProp<number | string>;
//   bg?: ResponsiveProp<string>;
//   rounded?: ResponsiveProp<string>;
//   shadow?: ResponsiveProp<string>;
//   opacity?: ResponsiveProp<number>;
//   display?: ResponsiveProp<'hidden' | 'block' | 'flex' | 'grid'>;
// }

// // Famille : Container
// interface ContainerStyles extends CommonStyles {
//   columns?: ResponsiveProp<number>;
//   gap?: ResponsiveProp<number>;
//   direction?: ResponsiveProp<'horizontal' | 'vertical'>;
//   justify?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
//   align?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
//   border?: ResponsiveProp<string>;
// }

// // Famille : Static (Texte, etc.)
// interface StaticStyles extends CommonStyles {
//   fontSize?: ResponsiveProp<string>;
//   fontWeight?: ResponsiveProp<string>;
//   textAlign?: ResponsiveProp<'left' | 'center' | 'right'>;
//   textColor?: ResponsiveProp<string>;
// }

// // Famille : Interactive (Boutons, liens)
// interface InteractiveStyles extends CommonStyles {
//   variant?: string;
//   size?: string;
// }

// interface ComponentProps<T = CommonStyles> {
//   styles?: T;
//   data?: Record<string, unknown>;
// }



// type IComponentPropsType = 
//   | ComponentProps<ContainerStyles>
//   | ComponentProps<StaticStyles>
//   | ComponentProps<InteractiveStyles>
//   | ComponentProps<CommonStyles>;



// export type {
//     IComponentPropsType,
//     ContainerStyles,
//     StaticStyles,
//     InteractiveStyles,
//     CommonStyles,
//     CliquableAction,
//     ComponentFamily
// }
