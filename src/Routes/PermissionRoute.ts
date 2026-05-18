
import type { IRouter } from "express";
import PermissionController from "../Controllers/PermissionController.ts";
import { permissionSchema } from "../Utils/Validations/PermissionSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";


export  function permissionRoutes(app:IRouter,validateBody:Function) : void {
    
    const permissionController = new PermissionController();

    
    // Routes PermissionControllers
    app.get("/permissions", AuthMiddleware, requirePermission("read_permission"), permissionController.getPermissions.bind(permissionController));
    app.get("/permissions/:id", AuthMiddleware, requirePermission("read_permission"), permissionController.getPermsById.bind(permissionController));
    app.get("/permissionsByRoleId/:id",AuthMiddleware, permissionController.getPermissionsByRoleId.bind(permissionController));
    app.post("/permissions", AuthMiddleware, requirePermission("create_permission"), validateBody(permissionSchema), permissionController.createPermission.bind(permissionController));
    app.put("/permissions/:id", AuthMiddleware, requirePermission("update_permission"), validateBody(permissionSchema), permissionController.upadatePerms.bind(permissionController));
    app.put("/archivePermissions/:id", AuthMiddleware, requirePermission("delete_permission"), permissionController.deletePerms.bind(permissionController));
    app.put("/restorePermissions/:id",AuthMiddleware, requirePermission("update_permission"), permissionController.restorePerms.bind(permissionController));
}