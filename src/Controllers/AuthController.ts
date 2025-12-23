
// Importation des modules
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CONFLICT,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";
import AuthService from "../Services/AuthService.ts";
import setAuthCookies, { SetAccesCookie } from "../Utils/Scripts/SetAuthCookies.ts";
import type { User } from "../Types/User.ts";


// Instanciation des services
const userService = new UserService();
const authService = new AuthService();



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
                    role: user.role?.name ?? null                    
                }
            });

        }


        // Register ( Creation De Compte )
        public async register(req:Request,res:Response): Promise<Response> {

            const { full_name, email, password }=req.body;
            try {
                
                // Verification de l'existance de l'utilisateur
                const userExist = await userService.getUserByEmail(email);
                if (userExist){
                    return res.status(HTTP_STATUS_CONFLICT).json({ message: 'Cet email est déjà utilisé.' });
                }
                // Hachage du password
                const password_hash = await userService.hashPassword(password);
                if (!password_hash) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({message:'Hachage du password echouer'});
                }

                // Partier de Role : Avoir apres

                // Creation d'user 
                const newUser = await userService.createUser({
                    full_name:full_name,
                    email:email,
                    password_hash:password_hash
                });

                // Message de Retour 
                const message="Inscription réussie et connexion établie.";
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
                const user = await userService.getUserByEmail(email);
                if (!user) {
                    console.log("Email Invalide");
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Identifiants invalides.' });
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

}