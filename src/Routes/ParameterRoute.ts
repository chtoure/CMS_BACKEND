import type { Express } from "express";
import ParameterController from "../Controllers/ParameterController.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { parameterSchema } from "../Utils/Validations/ParameterSchema.ts";


export  function parameterRoutes(app:Express) : void {
    const parameterController = new ParameterController();

    app.get("/parameters", parameterController.getParams.bind(parameterController));
    app.put("/parameters",validateBody(parameterSchema), parameterController.updateParams.bind(parameterController));
}