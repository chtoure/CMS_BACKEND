
import type { Express } from "express";
import { Router } from "express";
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
import { contentEntryRoutes } from "./ContentEntryRoute.ts";
import { taxonomyRoutes } from "./TaxonomyRoute.ts";
import { taxonomyTermRoutes } from "./TaxonomyTermRoute.ts";
import { componentRoutes } from "./ComponentRoute.ts";
import { sectionRoutes } from "./SectionRoute.ts";
import { blocTemplateRoutes } from "./BlocTemplateRoute.ts";
import { pageRevisionRoutes } from "./PageRevisionRoute.ts";
import { pageRoutes } from "./PageRoute.ts";
import { navItemRoutes } from "./NavItemRoute.ts";



export default (app: Express): void => {

    // Toutes les routes sont préfixées par /api
    const router = Router();

    // Module Authentification
    authRoutes(router, validateBody);
    userRoutes(router, validateBody);
    roleRoutes(router, validateBody);
    permissionRoutes(router, validateBody);

    // Module Mediatheque && Variable && Parameter
    mediaRoutes(router);
    variableRoutes(router);
    parameterRoutes(router);

    // Module Mock
    mockRoutes(router);

    // Module ContentType
    contentTypeRoutes(router, validateBody);

    // Module ContentEntry
    contentEntryRoutes(router);
    // Module Taxonomy
    taxonomyRoutes(router, validateBody);
    taxonomyTermRoutes(router, validateBody);
    // Module Builder
    componentRoutes(router, validateBody);
    sectionRoutes(router, validateBody);
    blocTemplateRoutes(router, validateBody);
    pageRevisionRoutes(router, validateBody);
    pageRoutes(router, validateBody);
    navItemRoutes(router);

    // Montage du router sur le préfixe /api
    app.use("/api", router);

}