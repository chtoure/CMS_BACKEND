import { Router } from "express";
import type { Express } from "express";
import { 
    createNavItem, 
    deleteNavItem, 
    getNavItemById, 
    getNavItems, 
    updateNavItem 
} from "../Controllers/NavItemController.ts";

export const navItemRoutes = (app: Express) => {
    const router = Router();
    
    router.post("/", createNavItem);
    router.get("/", getNavItems);
    router.get("/:id", getNavItemById);
    router.put("/:id", updateNavItem);
    router.delete("/:id", deleteNavItem);

    app.use("/api/nav-item", router);
};
