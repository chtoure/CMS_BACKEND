
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import UserService from "../Services/UserService.ts";


const userService = new UserService();



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

        try {
            
            const user = await userService.updateUser(Number(req.params.id), req.body);
            res.status(HTTP_STATUS_OK).json(user);

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

}