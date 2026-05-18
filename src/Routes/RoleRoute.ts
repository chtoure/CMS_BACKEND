
import type { IRouter } from "express";
import RoleController from "../Controllers/RoleController.ts";
import { roleSchema, roleUpdateSchema } from "../Utils/Validations/RoleSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";


export  function roleRoutes(app:IRouter,validateBody:Function) : void {

    const roleController = new RoleController();

    
    // Routes RoleControllers
    app.get("/roles", AuthMiddleware, requirePermission("read_role"), roleController.getRoles.bind(roleController));
    app.get("/roles/:id", AuthMiddleware, requirePermission("read_role"), roleController.getRoleById.bind(roleController));
    app.get("/permissionsRole/:id", AuthMiddleware, requirePermission("read_role"), roleController.getPermissionByRoleId.bind(roleController));
    app.post("/roles", AuthMiddleware, requirePermission("create_role"), validateBody(roleSchema), roleController.createRole.bind(roleController));
    app.put("/roles/:id", AuthMiddleware, requirePermission("update_role"), validateBody(roleUpdateSchema), roleController.updateRole.bind(roleController));
    app.put("/archiveRoles/:id", AuthMiddleware, requirePermission("delete_role"), roleController.deleteRole.bind(roleController));
    app.put("/restoreRoles/:id", AuthMiddleware, requirePermission("update_role"), roleController.restoreRole.bind(roleController));
    app.post("/roles/:id/permissions", AuthMiddleware, requirePermission("update_role"), validateBody(roleUpdateSchema), roleController.addPermissionsToRole.bind(roleController));
    app.put("/archiveRoles/:id/permissions", AuthMiddleware, requirePermission("update_role"), roleController.removePermissionFromRole.bind(roleController));
    app.put("/restoreRoles/:id/permissions", AuthMiddleware, requirePermission("update_role"), roleController.restorePermissionFromRole.bind(roleController));

}