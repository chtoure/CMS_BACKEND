
// Importation des modules
import { Router } from "express";
import type { Express } from "express";
import validateBody from "../Middleware/ValidateBoody.ts";

import UserController from "../Controllers/UserController.ts";
import { UserSchema } from "../Utils/Validations/UserSchema.ts";




// Initialisation des des instaces des controlleurs
const userController = new UserController();



export default (app:Express): void  => {

    // Routes UserControllers
    app.get("/users", userController.getUsers.bind(userController));
    app.get("/users/:id", userController.getUser);
    app.put("/users/:id", validateBody(UserSchema), userController.updateUser)
    app.delete("/users/:id", userController.deleteUser);


}