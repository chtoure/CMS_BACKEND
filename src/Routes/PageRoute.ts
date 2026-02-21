

import type { Express } from "express";
import { registerPageSchema, updatePageSchema } from "../Utils/Validations/PageSchema.ts";
import PageController from "../Controllers/PageController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";

export  function pageRoutes(app:Express,validateBody:Function) : void {
    const pageController = new PageController();

    app.get("/pages", AuthMiddleware, pageController.getPages.bind(pageController));
    app.post("/page", AuthMiddleware, validateBody(registerPageSchema), pageController.createPage.bind(pageController));
    app.get("/page/:id", AuthMiddleware, pageController.getPageById.bind(pageController));
    app.put("/page/:id", AuthMiddleware, validateBody(updatePageSchema), pageController.updatePage.bind(pageController));
    app.delete("/page/:id", AuthMiddleware, pageController.deletePage.bind(pageController));
}