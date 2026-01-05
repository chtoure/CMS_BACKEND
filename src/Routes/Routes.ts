
import type { Express } from "express";
import validateBody from "../Middleware/ValidateBoody.ts";

import UserController from "../Controllers/UserController.ts";
import AuthController from "../Controllers/AuthController.ts";
import { userRegisterSchema } from "../Utils/Validations/UserSchema.ts";
import { mediaRoutes } from "./MediaRoute.ts";
import { variableRoutes } from "./VariableRoute.ts";




// Initialisation des des instaces des controlleurs
const userController = new UserController();
const authController = new AuthController();



export default (app:Express): void  => {

    // Routes UserControllers
    app.get("/users", userController.getUsers.bind(userController));
    app.get("/users/:id", userController.getUser);
    app.put("/users/:id", validateBody(userRegisterSchema), userController.updateUser)
    app.delete("/users/:id", userController.deleteUser);


    //  Routes AuthControllers
    app.post("/register",validateBody(userRegisterSchema),authController.register);

    mediaRoutes(app);
    variableRoutes(app);

}