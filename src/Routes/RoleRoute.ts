
import type { Express } from "express";
import RoleController from "../Controllers/RoleController.ts";
import { roleSchema, roleUpdateSchema } from "../Utils/Validations/RoleSchema.ts";


export  function roleRoutes(app:Express,validateBody:Function) : void {

    const roleController = new RoleController();

    
    // Routes RoleControllers
    app.get("/roles", roleController.getRoles.bind(roleController));
    app.get("/roles/:id", roleController.getRoleById.bind(roleController));
    app.get("/permissionsRole/:id", roleController.getPermissionByRoleId.bind(roleController));
    app.post("/roles", validateBody(roleSchema), roleController.createRole.bind(roleController));
    app.put("/roles/:id", validateBody(roleUpdateSchema), roleController.updateRole.bind(roleController));
    app.put("/archiveRoles/:id", roleController.deleteRole.bind(roleController));
    app.put("/restoreRoles/:id", roleController.restoreRole.bind(roleController));
    app.post("/roles/:id/permissions",validateBody(roleUpdateSchema), roleController.addPermissionsToRole.bind(roleController));
    app.put("/archiveRoles/:id/permissions", roleController.removePermissionFromRole.bind(roleController));
    app.put("/restoreRoles/:id/permissions", roleController.restorePermissionFromRole.bind(roleController));

}