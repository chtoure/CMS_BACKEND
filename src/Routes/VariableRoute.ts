import type { IRouter } from "express";
import CollectionController from "../Controllers/CollectionController.ts";
import VariableController from "../Controllers/VariableController.ts";
import {  
    variableCreateSchema, 
    variableUpdateSchema, 
    deleteMultipleSchema 
} from "../Utils/Validations/VariableSchema.ts";
import { collectionSchema } from "../Utils/Validations/CollectionSchema.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";

export function variableRoutes(app: IRouter): void {
    
    const collectionController = new CollectionController();
    const variableController = new VariableController();

    app.get("/collections", AuthMiddleware, requirePermission("read_collection"), collectionController.getAllCollections.bind(collectionController));
    
    app.post("/collections", AuthMiddleware, requirePermission("create_collection"), validateBody(collectionSchema), collectionController.createCollection.bind(collectionController));
    
    app.delete("/collections/:id", AuthMiddleware, requirePermission("delete_collection"), collectionController.deleteCollection.bind(collectionController));

    app.post("/variables", AuthMiddleware, requirePermission("create_variable"), validateBody(variableCreateSchema), variableController.createVariable.bind(variableController));
    
    app.put("/variables/:id", AuthMiddleware, requirePermission("update_variable"), validateBody(variableUpdateSchema), variableController.updateVariable.bind(variableController));
    
    app.delete("/variables/", AuthMiddleware, requirePermission("delete_variable"), validateBody(deleteMultipleSchema), variableController.deleteVariables.bind(variableController));

    app.delete("/variables/:id", AuthMiddleware, requirePermission("delete_variable"), variableController.deleteVariables.bind(variableController));

    app.get("/variables",  variableController.getAllVariables.bind(variableController));

    app.get("/variables/:id", variableController.getVariableById.bind(variableController));
}