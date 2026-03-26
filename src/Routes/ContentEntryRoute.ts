import type { Express } from "express";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import ContentEntryController from "../Controllers/ContentEntryController.ts";
import { switchStatusSchema, toggleArchiveSchema } from "../Utils/Validations/ContentEntrySchema.ts";
import { validateDynamicContent } from "../Middleware/ValidateDynamicContent.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";

export function contentEntryRoutes(app: Express): void {
    
    const entryController = new ContentEntryController();

    app.get("/content-entries/slug/:slug", requirePermission("read_content_entry"), entryController.getAllEntriesBySlug.bind(entryController));
    
    app.get("/content-entries/:id", requirePermission("read_content_entry"), entryController.getEntryById.bind(entryController));
    
    app.get("/content-entries-archived", AuthMiddleware, requirePermission("read_content_entry"), entryController.getArchivedEntries.bind(entryController));
    app.post("/content-entries/:slug", AuthMiddleware, requirePermission("create_content_entry"), validateDynamicContent, entryController.createEntry.bind(entryController));
    
    app.put("/content-entries/:id/:slug", AuthMiddleware, requirePermission("update_content_entry"), validateDynamicContent, entryController.updateEntry.bind(entryController));

    app.patch("/content-entries/:id/status", AuthMiddleware, validateBody(switchStatusSchema), entryController.updateStatus.bind(entryController));
    
    app.put("/content-entries/:id/archive", AuthMiddleware, entryController.toggleArchive.bind(entryController));

    app.delete("/content-entries/:id", entryController.deleteEntry.bind(entryController));

    app.get("/content-entries/id/:id", entryController.getEntriesByContentTypeIdControl.bind(entryController));
}