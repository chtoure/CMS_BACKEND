
import type { IRouter } from "express";
import AuthController from "../Controllers/AuthController.ts";
import { userRegisterSchema } from "../Utils/Validations/UserSchema.ts";
import { userLoginSchema } from "../Utils/Validations/UserSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import EmailController from "../Controllers/EmailController.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";




export  function authRoutes(app:IRouter,validateBody:Function) : void {

    const authController = new AuthController();
    const emailController = new EmailController();

    
    //  Routes AuthControllers && EmailControllers
    app.post("/register",AuthMiddleware,requirePermission("create_user"),validateBody(userRegisterSchema),authController.register.bind(authController));
    app.post("/login",validateBody(userLoginSchema),authController.login.bind(authController));
    app.post("/logout",authController.logout.bind(authController));
    app.post("/refresh-token",authController.refreshToken.bind(authController));
    app.post("/send-verification-code",emailController.sendVerificationEmail.bind(emailController));
    app.post("/verify-code/:id",emailController.verifyCode.bind(emailController));
    app.post("/reset-password/:id",validateBody(userLoginSchema),authController.reinitialisationPasswordLogin.bind(authController));
    app.post("/sendConfirmEmail/:id",authController.sendConfirmationEmail.bind(authController));
    app.get("/confirm-receipt",authController.confirmEmailReceipt.bind(authController));

}