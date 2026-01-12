
import type { Express } from "express";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import ContentEntryController from "../Controllers/ContentEntryController.ts";

export function contentEntryRoutes(app: Express): void {
    const entryController = new ContentEntryController();

    // Routes contentEntryController
    app.get("/content/:slug", AuthMiddleware, entryController.getAllEntries.bind(entryController));
    app.post("/content/:slug", AuthMiddleware, entryController.createEntry.bind(entryController));
    app.get("/content/:slug/:id", AuthMiddleware, entryController.getEntry.bind(entryController));
    app.put("/content/:slug/:id",AuthMiddleware,entryController.updateContentEntry.bind(entryController));
    app.put("/archiveEntry/:slug/:id", AuthMiddleware, entryController.archivedContentEntry.bind(entryController));
    app.put("/restoreEntry/:slug/:id", AuthMiddleware, entryController.restoreContentType.bind(entryController));
    app.delete("/content/:slug/:id", AuthMiddleware, entryController.deletecontentEntryArchived.bind(entryController));
}