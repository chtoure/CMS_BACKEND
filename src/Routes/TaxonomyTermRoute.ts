
import type { Express } from "express";
import TaxonomyTermController from "../Controllers/TaxonomyTermController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { taxonomyTermSchema, taxonomyTermUpdateSchema } from "../Utils/Validations/TaxonomySchema.ts";

export function taxonomyTermRoutes(app: Express, validateBody: Function): void {
    const taxonomyTermController = new TaxonomyTermController();

    
    // Routes TaxonomyTermController
    app.post("/terms", AuthMiddleware, validateBody(taxonomyTermSchema), taxonomyTermController.create.bind(taxonomyTermController));
    app.get("/terms/taxonomy/:taxonomyId", AuthMiddleware, taxonomyTermController.getTermsByTaxonomy.bind(taxonomyTermController));
    app.get("/terms/:id", taxonomyTermController.getTermById.bind(taxonomyTermController));
    app.get("/termsSlug/:slug", taxonomyTermController.getTermBySlug.bind(taxonomyTermController));
    app.put("/terms/:id", AuthMiddleware, validateBody(taxonomyTermUpdateSchema), taxonomyTermController.updateTerm.bind(taxonomyTermController));
    app.delete("/terms/:id", AuthMiddleware, taxonomyTermController.deleteTerm.bind(taxonomyTermController));
}
