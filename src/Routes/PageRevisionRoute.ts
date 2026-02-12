


import type { Express } from "express";
import PageRevisionController from "../Controllers/PageRevisionController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { updatePageRevisionSchema } from "../Utils/Validations/PageRevision.ts";

export  function pageRevisionRoutes(app:Express,validateBody:Function) : void {
    const pageRevisionController = new PageRevisionController();

    app.get("/page-revision", AuthMiddleware, pageRevisionController.getPageRevisions.bind(pageRevisionController));
    app.post("/page-revision/:pageId", AuthMiddleware, pageRevisionController.createPageRevision.bind(pageRevisionController));
    app.get("/page-revision/:id", AuthMiddleware, pageRevisionController.getPageRevisionById.bind(pageRevisionController));
    app.put("/page-revision/:id", AuthMiddleware, validateBody(updatePageRevisionSchema), pageRevisionController.updatePageRevision.bind(pageRevisionController));
    app.delete("/page-revision/:id", AuthMiddleware, pageRevisionController.deletePageRevision.bind(pageRevisionController));
}