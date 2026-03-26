

import type { Express } from "express";
import ContentTypeController from "../Controllers/ContentTypeController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { contentTypeSchema , contentTypeUpdateSchema } from "../Utils/Validations/ContentTypeSchema.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";




export  function contentTypeRoutes(app:Express,validateBody:Function) : void {

    const contentTypeController = new ContentTypeController();

    
    // Routes contentTypeController
    app.post("/contents", AuthMiddleware,requirePermission("create_content"),validateBody(contentTypeSchema) ,contentTypeController.create.bind(contentTypeController));
    app.get("/contents", AuthMiddleware, requirePermission("read_content"), contentTypeController.getAllContentTypes.bind(contentTypeController));
    app.get("/contents/:id", AuthMiddleware, requirePermission("read_content"), contentTypeController.getContentTypeById.bind(contentTypeController));
    app.get("/contentsSlug/:slug", contentTypeController.getContentTypeBySlug.bind(contentTypeController));
    app.get("/contentsExcepted/:id", AuthMiddleware, requirePermission("read_content"), contentTypeController.getContentTypesExcepted.bind(contentTypeController));
    app.put("/contents/:id", AuthMiddleware, requirePermission("update_content"), validateBody(contentTypeUpdateSchema), contentTypeController.updateContentType.bind(contentTypeController));
    app.put("/archiveContents/:id", AuthMiddleware, requirePermission("update_content"), contentTypeController.archivedContentType.bind(contentTypeController));
    app.put("/restoreContents/:id", AuthMiddleware, requirePermission("update_content"), contentTypeController.restoreContentType.bind(contentTypeController));
    app.delete("/contents/:id", AuthMiddleware, requirePermission("delete_content"), contentTypeController.deleteContentTypeArchived.bind(contentTypeController));
}