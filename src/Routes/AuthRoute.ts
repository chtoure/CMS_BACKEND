
import type { Express } from "express";
import AuthController from "../Controllers/AuthController.ts";
import { userRegisterSchema } from "../Utils/Validations/UserSchema.ts";
import { userLoginSchema } from "../Utils/Validations/UserSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";




export  function authRoutes(app:Express,validateBody:Function) : void {

    const authController = new AuthController();

    //  Routes AuthControllers
    app.post("/register",validateBody(userRegisterSchema),authController.register.bind(authController));
    app.post("/login",validateBody(userLoginSchema),authController.login.bind(authController));
    app.post("/logout",authController.logout.bind(authController));
    app.post("/refresh-token",authController.refreshToken.bind(authController));
    
    // app.post("/forgot-password",validateBody(userLoginSchema),authController.forgotPassword.bind(authController));
    // app.post("/reset-password",authController.resetPassword.bind(authController));
    // app.post("/change-password",authController.changePassword.bind(authController));
    // app.post("/verify-email",authController.verifyEmail.bind(authController));

}