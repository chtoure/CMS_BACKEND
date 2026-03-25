
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import PermissionService from "../Services/PermissionService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { RequestHelper } from "../Utils/queryFilter.ts";


const permissionService = new PermissionService();


export default class PermissionController {

    // Methode: Creation de permission
    async  createPermission(req:Request,res:Response) {
         try {
            const perms = await permissionService.createPermission(req.body);
            res.status(HTTP_STATUS_CREATED).json(perms);
         } catch (error) {
            console.error('Erreur lors de la creation d\'une permission', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
         }
    }

    // Methode : Recuperer tous les permissions
    async getPermissions(req:Request,res:Response){
        try {
            const filter = RequestHelper.getFilters(req);
            const permissions = await permissionService.getPermissions(filter);
            res.status(HTTP_STATUS_OK).json(permissions);
        } catch (error) {
            console.log('Erreur lors de la récupération des permissions:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
    

    // Methode : Recuperer une permission par son id
    async getPermsById(req:Request,res:Response){
        try {
            const permission =await permissionService.getPermissionById(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(permission);
        } catch (error) {
            console.log('Erreur lors de la récupération d\'une permission:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // Methode : Modifier une permission
    async upadatePerms(req:Request,res:Response){
        try {
            const pemsUpdated = await permissionService.updatePermission(Number(req.params.id),req.body);
            res.status(HTTP_STATUS_OK).json(pemsUpdated);
        } catch (error) {
            console.log('Erreur lors de la mise à jour de la permission:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    
    // Methode : Archiver une permission
    async deletePerms(req:Request,res:Response){
        try {
            const perm = await permissionService.deletePermission(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(perm);
        } catch (error) {
            console.log('Erreur lors de la suppression de la permission:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }



    
    
    // Methode : restorer une permission
    async restorePerms(req:Request,res:Response){
        try {
            const perm = await permissionService.RestorePermission(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(perm);
        } catch (error) {
            console.log('Erreur lors de la restauration de la permission:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    

    async getPermissionsByRoleId(req:Request,res:Response){
        try {

            console.log(req.params.id);
            
            const permissions =await permissionService.getPermissionsByRoleId(Number(req.params.id));

            console.log('permissions', permissions);
            
            res.status(HTTP_STATUS_OK).json(permissions);
        } catch (error) {
            console.log('Erreur lors de la récupération des permissions:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

}