import type { Express } from "express";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import ContentEntryController from "../Controllers/ContentEntryController.ts";
import { switchStatusSchema, toggleArchiveSchema } from "../Utils/Validations/ContentEntrySchema.ts";
import validateBody from "../Middleware/ValidateBoody.ts";

export function contentEntryRoutes(app: Express): void {
    
    const entryController = new ContentEntryController();

    // Récupérer les entrées d'un type précis par son SLUG (avec pagination/filtres optionnels)
    app.get("/content-entries/slug/:slug", AuthMiddleware, entryController.getAllEntriesBySlug.bind(entryController));
    
    // Récupérer une entrée spécifique par son ID
    app.get("/content-entries/:id", AuthMiddleware, entryController.getEntryById.bind(entryController));
    
    // Liste globale des archives
    app.get("/content-entries-archived", AuthMiddleware, entryController.getArchivedEntries.bind(entryController));

    // Créer une nouvelle entrée pour un type donné
    app.post("/content-entries/:slug", AuthMiddleware, entryController.createEntry.bind(entryController));
    
    // Mise à jour complète d'une entrée
    app.put("/content-entries/:id", AuthMiddleware, entryController.updateEntry.bind(entryController));

    // Changer le statut (PUBLISHED, DRAFT...)
    app.patch("/content-entries/:id/status", AuthMiddleware, validateBody(switchStatusSchema), entryController.updateStatus.bind(entryController));
    
    // Archiver ou Restaurer (on passe { "archive": true/false } dans le body)
    app.put("/content-entries/:id/archive", AuthMiddleware, validateBody(toggleArchiveSchema), entryController.toggleArchive.bind(entryController));

    // Suppression définitive
    app.delete("/content-entries/:id", AuthMiddleware, entryController.deleteEntry.bind(entryController));
}