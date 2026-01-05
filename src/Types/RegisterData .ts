
// Interface RegisterData

import type { Role } from "./Role.ts";




interface RegisterData {
  
  full_name: string;
  email: string;
  password: string;
  role:Role;

}