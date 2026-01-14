

import type { Express } from "express";
import ContentTypeController from "../Controllers/ContentTypeController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { contentTypeSchema , contentTypeUpdateSchema } from "../Utils/Validations/ContentTypeSchema.ts";




export  function contentTypeRoutes(app:Express,validateBody:Function) : void {

    const contentTypeController = new ContentTypeController();

    // Routes contentTypeController
    app.post("/contents", AuthMiddleware,validateBody(contentTypeSchema) ,contentTypeController.create.bind(contentTypeController));
    app.get("/contents", AuthMiddleware, contentTypeController.getContentTypes.bind(contentTypeController));
    app.get("/contentsNoPaginate", AuthMiddleware, contentTypeController.getContentTypesNoPaginate.bind(contentTypeController))
    app.get("/contents/:id", contentTypeController.getContentTypeById.bind(contentTypeController));
    app.get("/contentsSlug/:slug", contentTypeController.getContentTypeBySlug.bind(contentTypeController));
    app.put("/contents/:id", AuthMiddleware, validateBody(contentTypeUpdateSchema), contentTypeController.updateContentType.bind(contentTypeController));
    app.put("/archiveContents/:id", AuthMiddleware, contentTypeController.archivedContentType.bind(contentTypeController));
    app.put("/restoreContents/:id", AuthMiddleware, contentTypeController.restoreContentType.bind(contentTypeController));
    app.delete("/contents/:id", AuthMiddleware, contentTypeController.deleteContentTypeArchived.bind(contentTypeController));
}