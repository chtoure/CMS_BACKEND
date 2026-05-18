
import type { Express, Request, Response } from "express";
import { getContentTypeMock } from "../mock/fieldSchema.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { validateDynamicContent } from "../Middleware/ValidateDynamicContent.ts";
import { getContentEntryMock } from "../mock/contentEntry.ts";

export  function mockRoutes(app:IRouter) : void {

    app.get("/mock/content-type", (req:Request, res:Response)=>{
        return getContentTypeMock(req, res);
    });

    app.get("/mock/content-entry", (req:Request, res:Response)=>{
        return getContentEntryMock(req, res);
    });

    app.post("/mock/content-type", validateDynamicContent, (req:Request, res:Response)=>{
        console.log(
            req.body
        );
        ;
    });


    
}