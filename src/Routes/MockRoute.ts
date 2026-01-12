
import type { Express, Request, Response } from "express";
import { getContentTypeMock } from "../mock/fieldSchema.ts";

export  function mockRoutes(app:Express) : void {

    app.get("/mock/content-type", (req:Request, res:Response)=>{
        return getContentTypeMock(req, res);
    });
    
}