
import type { Express } from "express";
import UserController from "../Controllers/UserController.ts";
import { userRegisterSchema } from "../Utils/Validations/UserSchema.ts";




export  function userRoutes(app:Express,validateBody:Function) : void {

    const userController = new UserController();

    // Routes UserControllers
    app.get("/users", userController.getUsers.bind(userController));
    app.get("/users/:id", userController.getUser.bind(userController));
    app.put("/users/:id", validateBody(userRegisterSchema), userController.updateUser.bind(userController));
    app.delete("/users/:id", userController.deleteUser.bind(userController));

}