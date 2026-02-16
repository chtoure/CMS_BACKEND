




import type { Express } from "express";
import ComponentController from "../Controllers/ComponentController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { ComponentListSchema } from "../Utils/Validations/ComponentSchema.ts";




export  function componentRoutes(app:Express,validateBody:Function) : void {

    const componentController = new ComponentController();

    // Routes componentController
    app.post("/components",validateBody(ComponentListSchema) ,componentController.createComponent.bind(componentController));
    app.get("/components", AuthMiddleware, componentController.getComponents.bind(componentController));
    app.get("/components/:id", componentController.getComponentById.bind(componentController));
    app.get("/componentsSlug/:slug", componentController.getComponentByTag.bind(componentController));
    // app.put("/components/:id", AuthMiddleware, validateBody(componentUpdateSchema), componentController.updateComponent.bind(componentController));
    // app.delete("/components/:id", AuthMiddleware, componentController.deleteComponent.bind(componentController));
}