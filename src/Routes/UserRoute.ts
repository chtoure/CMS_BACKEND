
import type { Express } from "express";
import UserController from "../Controllers/UserController.ts";
import { userUpdateSchema } from "../Utils/Validations/UserSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { changePasswordSchema } from "../Utils/Validations/UserSchema.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";




export  function userRoutes(app:Express,validateBody:Function) : void {

    const userController = new UserController();

    
    // Routes UserControllers
    app.get("/users", AuthMiddleware, requirePermission("read_user"), userController.getUsers.bind(userController));
    app.get("/users/:id", AuthMiddleware, requirePermission("read_user"), userController.getUser.bind(userController));
    app.put("/users/:id", AuthMiddleware, requirePermission("update_user"), validateBody(userUpdateSchema), userController.updateUser.bind(userController));
    app.put("/archiveUsers/:id", AuthMiddleware, requirePermission("update_user"), userController.archivedUser.bind(userController));
    app.put("/restoreUers/:id", AuthMiddleware, requirePermission("update_user"), userController.restoreUser.bind(userController));
    app.put("/change-password/:id", AuthMiddleware, requirePermission("update_user"), validateBody(changePasswordSchema), userController.changePassword.bind(userController));
    app.delete("/deleteUsers/:id", AuthMiddleware, requirePermission("delete_user"), userController.deleteDefinitivelyUser.bind(userController));
}