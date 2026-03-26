import type { Express } from "express";
import BlocTemplateController from "../Controllers/BlocTemplateController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { registerBlocTemplateSchema, updateBlocTemplateSchema } from "../Utils/Validations/BlocTemplateSchema.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";



export function blocTemplateRoutes(app: Express,validateBody:Function){
    const blocTemplateController = new BlocTemplateController();

    app.post("/bloc-template",AuthMiddleware, requirePermission("create_page_revision"), blocTemplateController.createBlocTemplate.bind(blocTemplateController));
    app.put("/bloc-template/:id",AuthMiddleware, requirePermission("update_page_revision"), blocTemplateController.updateBlocTemplate.bind(blocTemplateController));

    app.get("/bloc-templates", blocTemplateController.getBlocTemplates.bind(blocTemplateController));
    app.delete("/bloc-template/:id",AuthMiddleware, requirePermission("delete_page_revision"), blocTemplateController.deleteBlocTemplate.bind(blocTemplateController));

    app.get("/bloc-template/:id", blocTemplateController.getBlocTemplateById.bind(blocTemplateController));

    app.get("/bloc-template-tree/:sectionId", blocTemplateController.getTreeSection.bind(blocTemplateController));

    app.get("/bloc-templates-components-custom", blocTemplateController.getBlocTemplatesCustom.bind(blocTemplateController));
}

