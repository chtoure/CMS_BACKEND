
// Importation des modules
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CONFLICT,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";
import AuthService from "../Services/AuthService.ts";
import setAuthCookies, { SetAccesCookie } from "../Utils/Scripts/SetAuthCookies.ts";
import type { User } from "../Types/User.ts";
import RoleService from "../Services/RoleService.ts";
import { EmailService } from "../Services/EmailService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import crypto from "crypto";

// Instanciation des services
const userService = new UserService();
const authService = new AuthService();
const roleService = new RoleService();




export default class AuthController {

        // Méthode privée réutilisable pour éviter la répétition
        private static async handleAuthentification(res:Response,user:User,message:string,status:number) {

             // Creation des tokens 
            const tokens = await authService.createTokens(user.id, user.full_name,user.role ?? null);

            if (!tokens) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({message:'Creation des tokens ont echoués'});
            }
            
            // Ajouter les tokens crées dans un cookie Http : avoir
            const {accessToken,refreshToken} = tokens;
            setAuthCookies(res, accessToken, refreshToken);

            // Réponse de succès
            return res.status(status).json({
                message: message,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    isLoggedIn: user.isLoggedIn                   
                }
            });

        }


        // Register ( Creation De Compte )
        public async register(req:Request,res:Response): Promise<Response> {

            const { full_name, email, role }=req.body;
            let roleData = null;
            try {
                
                // Verification de l'existance de l'utilisateur
                const userExist = await userService.getUserByEmail(email);
                if (userExist){
                    return res.status(HTTP_STATUS_CONFLICT).json({ message: 'Cet email est déjà utilisé.' });
                }

                const confirmToken = crypto.randomBytes(32).toString('hex');

                // Partier de Role :
                if (role) {
                    roleData = await roleService.getRoleByName(role);
                    if (!roleData) {
                       roleData = await roleService.createRole({name:role}); 
                    }
                }

                // Creation d'user 
                const newUser = await userService.createUser({
                    full_name:full_name,
                    email:email,
                    password_hash:"PENDING_PASSWORD_NOT_SET",
                    role_id: roleData? roleData.id : null,
                    isLoggedIn: false,
                    confirmationToken: confirmToken
                });


                // Envoie du message de confirmation
                const isSend = await EmailService.sendVerificationEmail(newUser.email,confirmToken);

                if (!isSend) {
                    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de la création de l\'utilisateur.' });
                }

                // Message de Retour 
                const message="Inscription réussie. Vérifier votre mail pour activer votre compte.";
                // Function : Creation de Tokens et Retour
                return AuthController.handleAuthentification(res, newUser,message,HTTP_STATUS_CREATED) ;

            } catch (error) {
                console.error('Erreur lors de l\'enregistrement:', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage });
            }

        }
        
        

        public async login(req:Request,res:Response): Promise<Response> {

            const { email, password } = req.body;
            try {
                
                // Verifier de l'existance de l'utisateur
                const user = await userService.getUserByEmailNonArchive(email);
                if (!user) {
                    console.log("Email Invalide");
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Identifiants invalides ou utilisateur archivé ou en attente de confirmation.' });
                }
                const isPasswordValid = await userService.comparePassword(password,user.password_hash);
                if (!isPasswordValid) {
                     console.log("Password Invalide");
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Identifiants invalides.' })
                }

                // Message de Retour 
                const message="Connexion Reussie.";
                // Function : Creation de Tokens et Retour
                return AuthController.handleAuthentification(res, user,message,HTTP_STATUS_OK) ;

            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage });
            }

        }



        


        // Refresh Token Access
        public async refreshToken(req: Request, res: Response): Promise<Response> {         
            const refreshToken = req.cookies.refresh_token as string;
            try {
                
                if (!refreshToken) {
                    return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Refresh Token manquant.' });
                }

                // Vérification du Refresh Token (cryptographie + BDD)
                const decodedPayload = await authService.verifyAndCheckRefreshToken(refreshToken);

                if (!decodedPayload?.payloadRefresh) {
                    console.log("Le token est invalide ou révoqué. Supprimer les cookies pour forcer la reconnexion.");
                    res.clearCookie('access_token');
                    res.clearCookie('refresh_token');
                    return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Session invalide ou expirée. Veuillez vous reconnecter.' });
                }

                const {payloadRefresh,user} = decodedPayload;

                // Création du nouvel Access Token (les Claims peuvent être lus du payload du refresh token)
                const newAccessToken = authService.createAccesToken(payloadRefresh.sub,user.full_name,user.role ?? null);
               
                // Envoi du nouvel Access Token par cookie
                SetAccesCookie(res,newAccessToken);

                return res.status(HTTP_STATUS_OK).json({ message: 'Access Token renouvelé.' });

            } catch (error) {
                console.error('Erreur lors de la renouvellation du token access', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage }); 
            }
        }



        // Logout : Deconnexion 
        public async logout(req: Request, res: Response): Promise<Response> {
            const refreshToken = req.cookies.refresh_token as string;
            try {

                if (refreshToken) {
                    await authService.revokeRefreshToken(refreshToken).catch(err => {
                        console.error("Erreur lors de la révocation BDD:", err);
                    });
                }

            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            } finally {
                // Suppression des cookies côté client
                res.clearCookie('access_token');
                res.clearCookie('refresh_token');
            }

            return res.status(HTTP_STATUS_NO_CONTENT).send("Deconnexion réussie.");
        }



        // Reinitialisation du mot de passe (Forgot Password) && se connecter plus tard
        public async reinitialisationPasswordLogin(req: Request, res: Response): Promise<Response> {
            const { email, password } = req.body;
            try {

                // Haschage du nouveau mot de passe
                const hashedPassword = await userService.hashPassword(password);
                if (!hashedPassword) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Hachage du mot de passe a échoué.' });
                }

                // Mise à jour du mot de passe dans la base de données
                const userModPassword = await userService.updateUser(Number(req.params.id), { password_hash: hashedPassword, isLoggedIn: true });
                if (!userModPassword) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'La mise à jour du mot de passe a échoué.' });
                }

                // Appel de la methode login
                return this.login(req, res);

            } catch (error) {
                console.error('Erreur lors de la réinitialisation du mot de passe:', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage });
            }
        }


        // Renvoyer l'email de confirmation
        public async sendConfirmationEmail(req: Request, res: Response): Promise<Response> {
            try {
                const result = await userService.resendConfirmationEmail(Number(req.params.id));
                if (!result) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Échec de l'envoi ou compte déjà validé." });
                }
                return res.status(HTTP_STATUS_OK).json({ message: 'Email de confirmation envoyé avec succès.' });
            } catch (error) {
                console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage });
            }
        }


        // Confirmer si le message a été bien envoyé
        public async confirmEmailReceipt(req: Request, res: Response): Promise<Response> {
            const { token,email } = req.query;
            try {
                if(!token || !email) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Paramètres de confirmation invalide.' });
                const result = await userService.confirmEmail(token as string,email as string);

                if (!result || !result.password) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Erreur lors de la confirmation de l\'email.' });
                }
                 
                await EmailService.sendWelcome(result.user.email,result.password);

                return res.send(`
                    <!DOCTYPE html>
                    <html lang="fr">
                        <head>
                            <meta charset="UTF-8"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        </head>
                        <body style="font-family: sans-serif;">
                            <div style="text-align:center; padding:50px; font-family: sans-serif;">
                                <div style="font-size: 50px;">📧</div>
                                <h1 style="color: #312782;">Vérification réussie !</h1>
                                <p style="font-size: 18px; color: #4b5563;">
                                    Votre compte est maintenant actif.
                                </p>
                                <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; display: inline-block;">
                                    <strong>Veuillez consulter votre boîte de réception :</strong><br>
                                    Nous venons de vous envoyer vos identifiants de connexion.
                                </p>
                                <div style="margin-top: 20px;">
                                    <small>Vous pouvez fermer cette fenêtre.</small>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
            } catch (error) {
                console.error('Erreur lors de la confirmation de l\'email:', error);
                const errorMessage = handlePrismaError(error);
                return res.status(getErrorStatus(error)).json({ message: errorMessage });
            }
        }


}