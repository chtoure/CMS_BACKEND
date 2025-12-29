

// interface UpdateUserPayload



export interface UpdateUserPayload {
 
  full_name?: string;
  email?: string;
  password_hash?: string;
  refreshToken?: string | null ;
  roleId?: number;

}