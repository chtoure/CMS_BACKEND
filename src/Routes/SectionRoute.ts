
import type { IRouter } from "express";
import SectionController from "../Controllers/SectionController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { registerSectionSchema, updateSectionSchema } from "../Utils/Validations/SectionSchama.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";



export function sectionRoutes(app: IRouter,validateBody:Function){
    const sectionController = new SectionController();
    
    app.post("/section",AuthMiddleware, requirePermission("create_page_revision"), validateBody(registerSectionSchema),sectionController.createSection.bind(sectionController));
    app.put("/section/:id",AuthMiddleware, requirePermission("update_page_revision"), sectionController.updateSection.bind(sectionController));
    app.get("/section/:id", sectionController.getSectionById.bind(sectionController));
    app.get("/section/revision/:id", sectionController.getSectionByRevisionId.bind(sectionController));
    app.delete("/section/:id",AuthMiddleware, requirePermission("delete_page_revision"), sectionController.deleteSection.bind(sectionController));

}