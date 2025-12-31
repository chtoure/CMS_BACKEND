
import type { Express } from "express";
import UserController from "../Controllers/UserController.ts";
import { userUpdateSchema } from "../Utils/Validations/UserSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { changePasswordSchema } from "../Utils/Validations/UserSchema.ts";




export  function userRoutes(app:Express,validateBody:Function) : void {

    const userController = new UserController();

    // Routes UserControllers
    app.get("/users", AuthMiddleware, userController.getUsers.bind(userController));
    app.get("/users/:id", userController.getUser.bind(userController));
    app.put("/users/:id", AuthMiddleware, validateBody(userUpdateSchema), userController.updateUser.bind(userController));
    app.delete("/users/:id", AuthMiddleware, userController.deleteUser.bind(userController));
    app.put("/users/:id/change-password", AuthMiddleware, validateBody(changePasswordSchema), userController.changePassword.bind(userController));
}