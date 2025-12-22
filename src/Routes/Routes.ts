
import type { Express } from "express";
import validateBody from "../Middleware/ValidateBoody.ts";

import { userRoutes } from "./UserRoute.ts";
import { authRoutes } from "./AuthRoute.ts";
import { mediaRoutes } from "./MediaRoute.ts";
import { variableRoutes } from "./VariableRoute.ts";
import { permissionRoutes } from "./PermissionRoute.ts";
import { roleRoutes } from "./RoleRoute.ts";





export default (app:Express): void  => {

    // Module Authentification
    userRoutes(app,validateBody);
    authRoutes(app,validateBody);
    permissionRoutes(app,validateBody);
    roleRoutes(app,validateBody);

    // Module Media & Variables
    mediaRoutes(app);
    variableRoutes(app);

}