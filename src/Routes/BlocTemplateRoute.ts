import type { Express } from "express";
import BlocTemplateController from "../Controllers/BlocTemplateController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { registerBlocTemplateSchema, updateBlocTemplateSchema } from "../Utils/Validations/BlocTemplateSchema.ts";



export function blocTemplateRoutes(app: Express,validateBody:Function){
    const blocTemplateController = new BlocTemplateController();

    // Routes BlocTemplateController
    // app.post("/bloc-template",AuthMiddleware,validateBody(registerBlocTemplateSchema),blocTemplateController.createBlocTemplate.bind(blocTemplateController));

    app.post("/bloc-template",AuthMiddleware ,blocTemplateController.createBlocTemplate.bind(blocTemplateController));
    app.put("/bloc-template/:id",AuthMiddleware, blocTemplateController.updateBlocTemplate.bind(blocTemplateController));

    // app.put("/bloc-template/:id",AuthMiddleware,validateBody(updateBlocTemplateSchema), blocTemplateController.updateBlocTemplate.bind(blocTemplateController));
    app.get("/bloc-templates",AuthMiddleware, blocTemplateController.getBlocTemplates.bind(blocTemplateController));
    app.delete("/bloc-template/:id",AuthMiddleware, blocTemplateController.deleteBlocTemplate.bind(blocTemplateController));

    app.get("/bloc-template/:id",AuthMiddleware, blocTemplateController.getBlocTemplateById.bind(blocTemplateController));

    app.get("/bloc-template-tree/:sectionId",AuthMiddleware, blocTemplateController.getTreeSection.bind(blocTemplateController));

    app.get("/bloc-templates-components-custom",AuthMiddleware, blocTemplateController.getBlocTemplatesCustom.bind(blocTemplateController));
}

