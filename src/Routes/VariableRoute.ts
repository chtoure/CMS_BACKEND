import type { Express } from "express";
import CollectionController from "../Controllers/CollectionController.ts";
import VariableController from "../Controllers/VariableController.ts";
import {  
    variableCreateSchema, 
    variableUpdateSchema, 
    deleteMultipleSchema 
} from "../Utils/Validations/VariableSchema.ts";
import { collectionSchema } from "../Utils/Validations/CollectionSchema.ts";
import validateBody from "../Middleware/ValidateBoody.ts";

export function variableRoutes(app: Express): void {
    
    const collectionController = new CollectionController();
    const variableController = new VariableController();

    app.get("/collections", collectionController.getAllCollections.bind(collectionController));
    
    app.post("/collections", validateBody(collectionSchema), collectionController.createCollection.bind(collectionController));
    
    app.delete("/collections/:id", collectionController.deleteCollection.bind(collectionController));

    app.post("/variables", validateBody(variableCreateSchema), variableController.createVariable.bind(variableController));
    
    app.put("/variables/:id", validateBody(variableUpdateSchema), variableController.updateVariable.bind(variableController));
    
    app.delete("/variables/", validateBody(deleteMultipleSchema), variableController.deleteVariables.bind(variableController));

    app.delete("/variables/:id", variableController.deleteVariables.bind(variableController));

    app.get("/variables", variableController.getAllVariables.bind(variableController));

    app.get("/variables/:id", variableController.getVariableById.bind(variableController));
}