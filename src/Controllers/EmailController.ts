
import type { Request, Response } from "express";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { EmailService } from "../Services/EmailService.ts";
import UserService from "../Services/UserService.ts";


const userService = new UserService();

export default class EmailController {
    
    async sendVerificationEmail(req: Request, res: Response) {
        
        const { toEmail } = req.body;
        try {

            const userByEmail = await userService.getUserByEmail(toEmail);
            if (!userByEmail) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Utilisateur non trouvé avec cet email." });
            }

            // Génération du code à 6 chiffres et expiration
            const userCode = EmailService.generateOTP();
            const codeExpiration = EmailService.getExpirationDate(10); // 5 minutes

            const success = await EmailService.sendVerificationCode(toEmail, userCode);
            // const success = true;
           
            if (success) {
            
                // Sauvegarde du code et de l'expiration dans la base de données
                const updatedUser = await userService.updateUser(userByEmail.id, {
                    resetCode: userCode,
                    codeExpiration: codeExpiration
                });

                if (!updatedUser) {
                    console.log("Failed to update user with code.");
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Échec de la mise à jour de l'utilisateur avec le code." });
                }

                res.status(HTTP_STATUS_OK).json({
                    user:{
                         id: updatedUser.id,
                        full_name: updatedUser.full_name,
                        email: updatedUser.email,
                        role: updatedUser.role?.name ?? null,
                        isLoggedIn: updatedUser.isLoggedIn 
                    },
                  message: "Email de vérification envoyé avec succès." 
                });
            } else {
                res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Échec de l'envoi de l'email de vérification." });
            }
        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de l'envoi de l'email de vérification.", details: error });
        }
    }


    async verifyCode(req: Request, res: Response) {

        const { code } = req.body;
        const userId = Number(req.params.id);

        try {
            const user = await userService.verifyResetCode(userId, code);
            if (!user) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Code invalide ou expiré." });
            }

            // Code valide - Réinitialisation réussie
            await userService.updateUser(user.id, {resetCode:null, codeExpiration: null});
            
            res.status(HTTP_STATUS_OK).json({ message: "Code vérifié avec succès. Vous pouvez réinitialiser votre mot de passe." });

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la vérification du code.", details: error });
        }
    }
}