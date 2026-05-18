

import type { IRouter } from "express";
import { registerPageSchema, updatePageSchema } from "../Utils/Validations/PageSchema.ts";
import PageController from "../Controllers/PageController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";

export  function pageRoutes(app:IRouter,validateBody:Function) : void {
    const pageController = new PageController();

    app.get("/pages", AuthMiddleware, requirePermission("read_page"), pageController.getPages.bind(pageController));
    app.post("/page", AuthMiddleware, requirePermission("create_page"), validateBody(registerPageSchema), pageController.createPage.bind(pageController));
    app.get("/page/:id", AuthMiddleware, requirePermission("read_page"), pageController.getPageById.bind(pageController));
    app.put("/page/:id", AuthMiddleware, requirePermission("update_page"), validateBody(updatePageSchema), pageController.updatePage.bind(pageController));
    app.delete("/page/:id", AuthMiddleware, requirePermission("delete_page"), pageController.deletePage.bind(pageController));
    app.get("/renderPage/:slug", pageController.renderFullPage.bind(pageController));
    app.get("/renderPage", pageController.renderFullPage.bind(pageController));
}