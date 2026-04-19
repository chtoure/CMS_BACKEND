import type { MediaProperty, VariableProperty } from "./component.ts";

export type ResponsiveProp<T = string> = T | {
  default: T;    
  sm?: T;        
  md?: T;        
  lg?: T;        
};

export interface BaseStyles {
    // Propriétés de mise en page
  marginTop?: VariableProperty<ResponsiveProp<number | string>>;
  marginBottom?: VariableProperty<ResponsiveProp<number | string>>;
  padding?: VariableProperty<ResponsiveProp<number | string>>;
  paddingX?: VariableProperty<ResponsiveProp<number | string>>;
  paddingY?: VariableProperty<ResponsiveProp<number | string>>;

  // Positionnement
  position?: VariableProperty<ResponsiveProp<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>>;
  top?: VariableProperty<ResponsiveProp<number | string>>;
  right?: VariableProperty<ResponsiveProp<number | string>>;
  bottom?: VariableProperty<ResponsiveProp<number | string>>;
  left?: VariableProperty<ResponsiveProp<number | string>>;
  zIndex?: VariableProperty<ResponsiveProp<number>>;
  
  // Propriétés d'apparence
  bg?: VariableProperty<ResponsiveProp<string>>;
  rounded?: VariableProperty<ResponsiveProp<string | number>>;
  roundedTopLeft?: VariableProperty<ResponsiveProp<string | number>>;
  roundedTopRight?: VariableProperty<ResponsiveProp<string | number>>;
  roundedBottomLeft?: VariableProperty<ResponsiveProp<string | number>>;
  roundedBottomRight?: VariableProperty<ResponsiveProp<string | number>>;
  shadow?: VariableProperty<ResponsiveProp<string | number>>;
  opacity?: VariableProperty<ResponsiveProp<number>>;
  display?: VariableProperty<ResponsiveProp<'hidden' | 'block' | 'flex' | 'grid'>>;
  width?: VariableProperty<ResponsiveProp<string | number>>;
  height?: VariableProperty<ResponsiveProp<string | number>>;

  // Arrière-plan média (image ou vidéo depuis la médiathèque)
  bgImage?: MediaProperty | VariableProperty<string>;
  bgVideo?: MediaProperty;
  bgSize?: VariableProperty<ResponsiveProp<'cover' | 'contain' | 'auto'>>;
  bgPosition?: VariableProperty<ResponsiveProp<string>>;
  bgRepeat?: VariableProperty<ResponsiveProp<'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'>>;
}

// Famille : Container
export interface ContainerStyles extends BaseStyles {
  columns?: VariableProperty<ResponsiveProp<number>>;
  gap?: VariableProperty<ResponsiveProp<number>>;
  direction?: VariableProperty<ResponsiveProp<'horizontal' | 'vertical'>>;
  justify?: VariableProperty<ResponsiveProp<'start' | 'center' | 'end' | 'between'>>;
  align?: VariableProperty<ResponsiveProp<'start' | 'center' | 'end' | 'between'>>;
  border?: VariableProperty<ResponsiveProp<string>>;
  borderWidth?: VariableProperty<ResponsiveProp<number | string>>;
  borderColor?: VariableProperty<ResponsiveProp<string>>;
  borderStyle?: VariableProperty<ResponsiveProp<'solid' | 'dashed' | 'dotted' | 'double' | 'hidden'>>;
}

// Famille : Static (Texte, etc.)
export interface StaticStyles extends BaseStyles {
  fontSize?: VariableProperty<ResponsiveProp<string>>;
  fontWeight?: VariableProperty<ResponsiveProp<string>>;
  textAlign?: VariableProperty<ResponsiveProp<'left' | 'center' | 'right'>>;
  textColor?: VariableProperty<ResponsiveProp<string>>;
  textDecoration?: VariableProperty<ResponsiveProp<'none' | 'underline'>>;
  bg?: VariableProperty<ResponsiveProp<string>>;
}

// Famille : Interactive (Boutons, liens)
export interface InteractiveStyles extends BaseStyles {
  variant?: VariableProperty<string>;
  size?: VariableProperty<string>;
  fontSize?: VariableProperty<ResponsiveProp<string>>;
  fontWeight?: VariableProperty<ResponsiveProp<string>>;
  textAlign?: VariableProperty<ResponsiveProp<'left' | 'center' | 'right'>>;
  textColor?: VariableProperty<ResponsiveProp<string>>;
  textDecoration?: VariableProperty<ResponsiveProp<'none' | 'underline'>>;
}

// Famille : Input
export interface InputStyles extends BaseStyles {
  fontSize?: VariableProperty<ResponsiveProp<string>>;
  fontWeight?: VariableProperty<ResponsiveProp<string>>;
  textColor?: VariableProperty<ResponsiveProp<string>>;
}

// Famille : Complex / Spécifiques
export interface SliderStyles extends ContainerStyles {
  slidesPerView?: VariableProperty<ResponsiveProp<number>>;
  transitionDuration?: VariableProperty<ResponsiveProp<number>>;
  transitionEase?: VariableProperty<ResponsiveProp<string>>;
  arrowColor?: VariableProperty<ResponsiveProp<string>>;
  arrowBg?: VariableProperty<ResponsiveProp<string>>;
  arrowSize?: VariableProperty<ResponsiveProp<number>>;
  paginationColor?: VariableProperty<ResponsiveProp<string>>;
  paginationActiveColor?: VariableProperty<ResponsiveProp<string>>;
  paginationShape?: VariableProperty<ResponsiveProp<'circle' | 'line' | 'square'>>;
}

export interface AccordionStyles extends BaseStyles {
  // Styles spécifiques à l'Accordéon
}

// Famille : Link
export interface LinkStyles extends StaticStyles {
  // Possibilité d'ajouter des styles au survol (hover) plus tard
}

// Union de tous les styles possibles
export type AllStyles = 
  | ContainerStyles 
  | StaticStyles 
  | InteractiveStyles 
  | InputStyles 
  | SliderStyles 
  | AccordionStyles 
  | LinkStyles
  | BaseStyles;
