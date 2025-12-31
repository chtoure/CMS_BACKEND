
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";
import RoleService from "../Services/RoleService.ts";


const userService = new UserService();
const roleService = new RoleService();




export default class UserController {

    async getUsers(req:Request,res:Response){

        try {
            
            const users = await userService.getAllUser();
            res.status(HTTP_STATUS_OK).json(users);

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'Erreur lors de la récupération des utilisateurs', details: error });
        }
    }



    async getUser(req:Request,res:Response){

        try {
            
            const user = await userService.getUserById(Number(req.params.id));
            if (!user) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Utilisateur non trouvé' });
            res.status(HTTP_STATUS_OK).json(user);

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la récupération de l'utilisateur", details: error });
        }

    }



    async updateUser(req:Request,res:Response){
        const { password , role } = req.body;
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


    async deleteUser(req:Request,res:Response){

        try {
            
            const user = await userService.deleteUser(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(user);

        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression de l'utilisateur", details: error });
        }
    }


    async changePassword(req:Request,res:Response){

        const { newPassword } = req.body;
        try {
            await userService.changeUserPassword(Number(req.params.id), newPassword);
            res.status(HTTP_STATUS_OK).json({
                message: "Mot de passe mis à jour avec succès"
            });
        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la mise à jour du mot de passe", details: error });
        }
    }

}