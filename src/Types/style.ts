type ResponsiveProp<T = string> = T | {
  default: T;    
  sm?: T;        
  md?: T;        
  lg?: T;        
};

// types/styles.ts

// Interface de base contenant toutes les propriétés communes
interface BaseStyles {
  // Propriétés de mise en page
  marginTop?: ResponsiveProp<number | string>;
  marginBottom?: ResponsiveProp<number | string>;
  padding?: ResponsiveProp<number | string>;
  
  // Propriétés d'apparence
  bg?: ResponsiveProp<string>;
  rounded?: ResponsiveProp<string | number>;
  roundedTopLeft?: ResponsiveProp<string | number>;
  roundedTopRight?: ResponsiveProp<string | number>;
  roundedBottomLeft?: ResponsiveProp<string | number>;
  roundedBottomRight?: ResponsiveProp<string | number>;
  shadow?: ResponsiveProp<string | number>;
  opacity?: ResponsiveProp<number>;
  display?: ResponsiveProp<'hidden' | 'block' | 'flex' | 'grid'>;
  width?: ResponsiveProp<string | number>;
  height?: ResponsiveProp<string | number>;
}

// Famille : Container
interface ContainerStyles extends BaseStyles {
  columns?: ResponsiveProp<number>;
  gap?: ResponsiveProp<number>;
  direction?: ResponsiveProp<'horizontal' | 'vertical'>;
  justify?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
  align?: ResponsiveProp<'start' | 'center' | 'end' | 'between'>;
  border?: ResponsiveProp<string>;
  borderWidth?: ResponsiveProp<number | string>;
  borderColor?: ResponsiveProp<string>;
  borderStyle?: ResponsiveProp<'solid' | 'dashed' | 'dotted' | 'double' | 'hidden'>;
}

// Famille : Static (Texte, etc.)
interface StaticStyles extends BaseStyles {
  fontSize?: ResponsiveProp<string>;
  fontWeight?: ResponsiveProp<string>;
  textAlign?: ResponsiveProp<'left' | 'center' | 'right'>;
  textColor?: ResponsiveProp<string>;
}

// Famille : Interactive (Boutons, liens)
interface InteractiveStyles extends BaseStyles {
  variant?: string;
  size?: string;
  fontSize?: ResponsiveProp<string>;
  fontWeight?: ResponsiveProp<string>;
  textAlign?: ResponsiveProp<'left' | 'center' | 'right'>;
  textColor?: ResponsiveProp<string>;
}

// Famille : Input
interface InputStyles extends BaseStyles {
  fontSize?: ResponsiveProp<string>;
  fontWeight?: ResponsiveProp<string>;
  textColor?: ResponsiveProp<string>;
}

// types/component.ts
type AllStyles = ContainerStyles | StaticStyles | InteractiveStyles | InputStyles | BaseStyles;


export type {
    AllStyles,
    BaseStyles,
    ContainerStyles,
    StaticStyles,
    InteractiveStyles,
    InputStyles,
    ResponsiveProp
}