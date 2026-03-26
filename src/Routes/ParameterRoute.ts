import type { Express } from "express";
import ParameterController from "../Controllers/ParameterController.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { parameterSchema } from "../Utils/Validations/ParameterSchema.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";


export  function parameterRoutes(app:Express) : void {
    const parameterController = new ParameterController();

    app.get("/parameters", parameterController.getParams.bind(parameterController));
    app.put("/parameters",AuthMiddleware,requirePermission("update_parameter"),validateBody(parameterSchema), parameterController.updateParams.bind(parameterController));
}