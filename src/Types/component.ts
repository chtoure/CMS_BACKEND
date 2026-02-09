import type { Prisma } from "../generated/prisma/client.ts";


type JsonValue = 
  | string 
  | number  
  | null 
  | undefined 
  | Function 
  | { [key: string]: JsonValue } 
  | Prisma.JsonValue[];

interface Component {
    name: string;
    tag: string;
    description: string;
    default_props: JsonValue;
}

export type {
    Component
};