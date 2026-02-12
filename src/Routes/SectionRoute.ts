
import type { Express } from "express";
import SectionController from "../Controllers/SectionController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { registerSectionSchema, updateSectionSchema } from "../Utils/Validations/SectionSchama.ts";



export function sectionRoutes(app: Express,validateBody:Function){
    const sectionController = new SectionController();

    // Routes SectionController
    app.post("/section",AuthMiddleware,validateBody(registerSectionSchema),sectionController.createSection.bind(sectionController));
    app.get("/section",AuthMiddleware, sectionController.getSections.bind(sectionController));
    app.get("/section/:id",AuthMiddleware, sectionController.getSectionById.bind(sectionController));
    app.get("/render-page/:pageId",AuthMiddleware, sectionController.getFullPage.bind(sectionController));
    app.put("/section/:id",AuthMiddleware,validateBody(updateSectionSchema), sectionController.updateSection.bind(sectionController));
    app.delete("/section/:id",AuthMiddleware, sectionController.deleteSection.bind(sectionController));
}