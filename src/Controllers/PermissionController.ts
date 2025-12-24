
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import PermissionService from "../Services/PermissionService.ts";


const permissionService = new PermissionService();


export default class PermissionController {

    // Methode: Creation de permission
    async  createPermission(req:Request,res:Response) {
         try {
            const perms = await permissionService.createPermission(req.body);
            res.status(HTTP_STATUS_CREATED).json(perms);
         } catch (error) {
            console.error('Erreur lors de la creation d\'une permission', error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la creation d\'une permission.' });
         }
    }


    // Methode : Recuperer tous les permissions
    async getAllPerms(req:Request,res:Response){
        try {
            const dataPerms = await permissionService.getAllPermissions();
            res.status(HTTP_STATUS_OK).json(dataPerms);
        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération des permissions', details: error });
        }
    }


    // Methode : Recuperer une permission par son id
    async getPermsById(req:Request,res:Response){
        try {
            const permission =await permissionService.getPermissionById(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(permission);
        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération d\'une permission', details: error });
        }
    }


    // Methode : Modifier une permission
    async upadatePerms(req:Request,res:Response){
        try {
            const pemsUpdated = await permissionService.updatePermission(Number(req.params.id),req.body);
            res.status(HTTP_STATUS_OK).json(pemsUpdated);
        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la mise à jour de la permision", details: error });
        }
    }


    
    // Methode : Supprimer une permission
    async deletePerms(req:Request,res:Response){
        try {
            const perm = await permissionService.deletePermission(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(perm);
        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression de la permission", details: error });
        }
    }

}