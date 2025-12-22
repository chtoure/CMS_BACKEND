
import type { Express } from "express";
import PermissionController from "../Controllers/PermissionController.ts";
import { permissionSchema } from "../Utils/Validations/PermissionSchema.ts";


export  function permissionRoutes(app:Express,validateBody:Function) : void {
    
    const permissionController = new PermissionController();

    // Routes PermissionControllers
    app.get("/permissions", permissionController.getAllPerms.bind(permissionController));
    app.get("/permissions/:id", permissionController.getPermsById.bind(permissionController));
    app.post("/permissions", validateBody(permissionSchema), permissionController.createPermission.bind(permissionController));
    app.put("/permissions/:id", validateBody(permissionSchema), permissionController.upadatePerms.bind(permissionController));
    app.delete("/permissions/:id", permissionController.deletePerms.bind(permissionController));
    
}