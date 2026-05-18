




import type { IRouter } from "express";
import ComponentController from "../Controllers/ComponentController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { ComponentListSchema } from "../Utils/Validations/ComponentSchema.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";




export  function componentRoutes(app:IRouter,validateBody:Function) : void {

    const componentController = new ComponentController();

    app.post("/components", AuthMiddleware, requirePermission(["create_page_revision", "update_page_revision"]), validateBody(ComponentListSchema) ,componentController.createComponent.bind(componentController));
    app.get("/components", AuthMiddleware, componentController.getComponents.bind(componentController));
    app.get("/components/:id", componentController.getComponentById.bind(componentController));
    app.get("/componentsSlug/:slug", componentController.getComponentByTag.bind(componentController));
}