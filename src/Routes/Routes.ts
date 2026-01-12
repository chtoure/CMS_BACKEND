
import type { Express } from "express";
import validateBody from "../Middleware/ValidateBoody.ts";

import { mediaRoutes } from "./MediaRoute.ts";
import { variableRoutes } from "./VariableRoute.ts";
import { authRoutes } from "./AuthRoute.ts";
import { userRoutes } from "./UserRoute.ts";
import { roleRoutes } from "./RoleRoute.ts";
import { permissionRoutes } from "./PermissionRoute.ts";
import { parameterRoutes } from "./ParameterRoute.ts";
import { mockRoutes } from "./MockRoute.ts";
import { contentTypeRoutes } from "./ContentTypeRoute.ts";




export default (app:Express): void  => {

    // Module Authentification
    authRoutes(app,validateBody);
    userRoutes(app,validateBody);
    roleRoutes(app,validateBody);
    permissionRoutes(app,validateBody);

    // Module Mediatheque && Variable && Parameter
    mediaRoutes(app);
    variableRoutes(app);
    parameterRoutes(app);

    // Module Mock
    mockRoutes(app);

    //Moodule ContentType
    contentTypeRoutes(app,validateBody)

}