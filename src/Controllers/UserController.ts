
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";
import RoleService from "../Services/RoleService.ts";
import { MailboxLayerService } from "../Utils/VerifyExistenceEmail.ts";


const userService = new UserService();
const roleService = new RoleService();




export default class UserController {

   async getUsers(req: Request, res: Response) {
    
        try {
            // Calculs de base pour la pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const filter = req.query.archive === 'true' ? true : req.query.archive === 'false' ? false : null;
            

            // Appel simultané pour les données et le total
            const [userList, totalCount] = await Promise.all([
                userService.getAllUser(filter,skip, limit),
                userService.countUsers(filter)
            ]);

            const totalPages = Math.ceil(totalCount / limit);
            const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            // Construction des liens de navigation
            const next = page < totalPages 
                ? `${fullUrl}?page=${page + 1}&limit=${limit}${filter ? `&archive=${filter}` : ''}` 
                : null;
            const previous = page > 1 
                ? `${fullUrl}?page=${page - 1}&limit=${limit}${filter ? `&archive=${filter}` : ''}` 
                : null;

            // Réponse structurée
            return res.status(HTTP_STATUS_OK).json({
                count: totalCount,
                next: next,
                previous: previous,
                total_pages: totalPages,
                current_page: page,
                results: userList
            });

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des utilisateurs", 
                details: error 
            });
        }
    }



    async getUser(req:Request,res:Response){

        try {
            
            const user = await userService.getUserById(Number(req.params.id));
            if (!user) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Utilisateur non trouvé ou archivé' });
            res.status(HTTP_STATUS_OK).json(user);

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la récupération de l'utilisateur", details: error });
        }

    }



    async updateUser(req:Request,res:Response){
        const { password , email , role } = req.body;
        let roleData = null;
        
        try {

            if (password) {
                // Hachage du password
                const password_hash = await userService.hashPassword(password);
                if (!password_hash) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).json({message:'Hachage du password echouer'});
                }
                req.body.password_hash = password_hash;
                delete req.body.password;
            }

            // Validation de l'email via MailboxLayer
            if (email) {

                // Verification de l'existance de l'utilisateur
                const userExist = await userService.getUserByEmail(email);
                if (!userExist){                   
                    // Validation de l'email via MailboxLayer
                    const isEmailValid = await MailboxLayerService.checkExistence(email);
                    if (!isEmailValid.success) {
                        console.log("Email non valide:", isEmailValid.message);
                        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: isEmailValid.message });
                    }
                }

            }

            // Partie de Role :
            if (role) {
                roleData = await roleService.getRoleByName(role);
                if (!roleData) {
                   roleData = await roleService.createRole({name:role}); 
                }
                req.body.role_id = roleData.id;
                delete req.body.role;
            }
            
            const user = await userService.updateUser(Number(req.params.id), req.body);
            res.status(HTTP_STATUS_OK).json({
                message: "Utilisateur mis à jour avec succès",
                user: {
                    id: user?.id,
                    full_name: user?.full_name,
                    email: user?.email,
                    role: user?.role?.name ?? null                    
                }
            });

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la mise à jour de l'utilisateur", details: error });
        }
    }


    // User archiver
    async deleteUser(req:Request,res:Response){

        try {
            
            const user = await userService.deleteUser(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(user);

        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression de l'utilisateur", details: error });
        }
    }


    // restorer un utilisateur archivés
    async restoreUser(req:Request,res:Response){

        try {
            
            const user = await userService.restoreUser(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(user);

        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la restoration de l'utilisateur", details: error });
        }
    }



    async changePassword(req:Request,res:Response){
        const { newPassword } = req.body;
        try {
            
            
            const userChangedPassword = await userService.changeUserPassword(Number(req.params.id), newPassword);
            res.status(HTTP_STATUS_OK).json({
                message: "Mot de passe mis à jour avec succès",
                user: {
                    id: userChangedPassword?.id,
                    full_name: userChangedPassword?.full_name,
                    email: userChangedPassword?.email,
                    role: userChangedPassword?.role?.name ?? null,
                    isLoggedIn: userChangedPassword?.isLoggedIn
                }
            });
        } catch (error) {
            console.log("Erreur lors de la mise à jour du mot de passe", error);
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la mise à jour du mot de passe", details: error });
        }
    }

}