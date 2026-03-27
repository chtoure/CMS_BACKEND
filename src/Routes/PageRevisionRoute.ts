


import type { Express } from "express";
import PageRevisionController from "../Controllers/PageRevisionController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { updatePageRevisionSchema } from "../Utils/Validations/PageRevision.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";

export  function pageRevisionRoutes(app:Express,validateBody:Function) : void {
    const pageRevisionController = new PageRevisionController();

    app.get("/page-revision", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisions.bind(pageRevisionController));
    app.post("/page-revision", AuthMiddleware, requirePermission("create_page_revision"), pageRevisionController.createPageRevision.bind(pageRevisionController));
    app.get("/page-revision/:id", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisionById.bind(pageRevisionController));
    app.get("/page-revisions/page/:id", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisionsByPageId.bind(pageRevisionController));
    app.put("/page-revision/:id", AuthMiddleware, requirePermission("update_page_revision"), validateBody(updatePageRevisionSchema), pageRevisionController.updatePageRevision.bind(pageRevisionController));
    app.delete("/page-revision/:id", AuthMiddleware, requirePermission("delete_page_revision"), pageRevisionController.deletePageRevision.bind(pageRevisionController));
}