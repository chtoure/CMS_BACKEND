
import type { Express } from "express";
import TaxonomyController from "../Controllers/TaxonomyController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { taxonomySchema, taxonomyUpdateSchema } from "../Utils/Validations/TaxonomySchema.ts";

export function taxonomyRoutes(app: Express, validateBody: Function): void {
    const taxonomyController = new TaxonomyController();

    
    // Routes TaxonomyController
    app.post("/taxonomies", AuthMiddleware, validateBody(taxonomySchema), taxonomyController.create.bind(taxonomyController));
    app.get("/taxonomies", AuthMiddleware, taxonomyController.getAllTaxonomies.bind(taxonomyController));
    app.get("/taxonomies/:id", taxonomyController.getTaxonomyById.bind(taxonomyController));
    app.get("/taxonomiesSlug/:slug", taxonomyController.getTaxonomyBySlug.bind(taxonomyController));
    app.get("/taxonomiesTerms/:taxonomyIds", taxonomyController.getTaxonomyTermsByTaxonomyIds.bind(taxonomyController));
    app.put("/taxonomies/:id", AuthMiddleware, validateBody(taxonomyUpdateSchema), taxonomyController.updateTaxonomy.bind(taxonomyController));
    app.put("/archiveTaxonomies/:id", AuthMiddleware, taxonomyController.archivedTaxonomy.bind(taxonomyController));
    app.put("/restoreTaxonomies/:id", AuthMiddleware, taxonomyController.restoreTaxonomy.bind(taxonomyController));
    app.delete("/taxonomies/:id", AuthMiddleware, taxonomyController.deleteTaxonomyArchived.bind(taxonomyController));
}   
