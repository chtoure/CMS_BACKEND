
import type { Express } from "express";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import ContentEntryController from "../Controllers/ContentEntryController.ts";

export function contentEntryRoutes(app: Express): void {
    
    const entryController = new ContentEntryController();

    app.get("/content-entry/by-slug/:slug", AuthMiddleware, entryController.getAllEntries.bind(entryController));
    app.get("/content-entry", AuthMiddleware, entryController.getAllContentEntry.bind(entryController));
    app.get("/content-entry/noPaginate", AuthMiddleware, entryController.getAllContentEntryNoPaginate.bind(entryController));
    app.get("/content-entry/content-type/:id", AuthMiddleware, entryController.getContentEntriesByContentTypeID.bind(entryController));
    app.post("/content-entry/:slug", AuthMiddleware, entryController.createEntry.bind(entryController));
    app.get("/content-entry/:id", AuthMiddleware, entryController.getEntry.bind(entryController));
    app.put("/content-entry/:id",AuthMiddleware, entryController.updateContentEntry.bind(entryController));
    app.put("/archive-entry/:slug/:id", AuthMiddleware, entryController.archivedContentEntry.bind(entryController));
    app.put("/restore-entry/:slug/:id", AuthMiddleware, entryController.restoreContentType.bind(entryController));
    app.delete("/content-entry/:slug/:id", AuthMiddleware, entryController.deletecontentEntryArchived.bind(entryController));
}