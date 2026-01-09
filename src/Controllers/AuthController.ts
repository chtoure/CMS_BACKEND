
// Importation des modules
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CONFLICT,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";
import AuthService from "../Services/AuthService.ts";
import setAuthCookies, { SetAccesCookie } from "../Utils/Scripts/SetAuthCookies.ts";
import type { User } from "../Types/User.ts";
import RoleService from "../Services/RoleService.ts";
import { MailboxLayerService } from "../Utils/VerifyExistenceEmail.ts";
import { EmailService } from "../Services/EmailService.ts";

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
                    role: user.role?.name ?? null,
                    isLoggedIn: user.isLoggedIn                   
                }
            });

        }


        // Register ( Creation De Compte )
        public async register(req:Request,res:Response): Promise<Response> {

            const { full_name, email, password, role }=req.body;
            let roleData = null;
            let passwordFinal = password;
            try {
                
                // Verification de l'existance de l'utilisateur
                const userExist = await userService.getUserByEmail(email);
                if (userExist){
                    return res.status(HTTP_STATUS_CONFLICT).json({ message: 'Cet email est déjà utilisé.' });
                }

                // Validation de l'email via MailboxLayer
                const isEmailValid = await MailboxLayerService.checkExistence(email);
                if (!isEmailValid.success) {
                    console.log("Email non valide:", isEmailValid.message);
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: isEmailValid.message });
                }

                // Si le mot de passe n'est pas fourni, générer un mot de passe par défaut                
                if (!passwordFinal) {
                    passwordFinal = "defaultPassword123"; // Valeur par défaut si aucun mot de passe n'est fourni
                }  

                // Hachage du password
                const password_hash = await userService.hashPassword(passwordFinal);
                if (!password_hash) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({message:'Hachage du password echouer'});
                }

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
                    password_hash:password_hash,
                    role_id: roleData? roleData.id : null,
                    isLoggedIn: false
                });


                // Envoie du password par defaut a l'utilisateur
                const isSend = await EmailService.sendVerificationCode(newUser.email,passwordFinal);

                if (!isSend) {
                    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de la création de l\'utilisateur.' });
                }

                // Message de Retour 
                const message="Inscription réussie .";
                // Function : Creation de Tokens et Retour
                return AuthController.handleAuthentification(res, newUser,message,HTTP_STATUS_CREATED) ;

            } catch (error) {
                console.error('Erreur lors de l\'enregistrement:', error);
                return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de la création de l\'utilisateur.' });
            }

        }
        
        

        public async login(req:Request,res:Response): Promise<Response> {

            const { email, password } = req.body;
            try {
                
                // Verifier de l'existance de l'utisateur
                const user = await userService.getUserByEmailNonArchive(email);
                if (!user) {
                    console.log("Email Invalide");
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Identifiants invalides ou utilisateur archivé.' });
                }
                console.log("Utilisateur trouvé:", user);
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
                return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de l\'authentification.' });
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
                return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la renouvellation du token access' }); 
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
                return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de la réinitialisation du mot de passe.' });
            }
        }

}