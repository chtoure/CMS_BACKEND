
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import PermissionService from "../Services/PermissionService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";


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
    async getAllPerms(req:Request,res:Response){

        try {

            // Calculs de base pour la pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const filter = req.query.archive === 'true' ? true : req.query.archive === 'false' ? false : null;

            // Appel simultané pour les données et le total
            const [permsListes, totalCount] = await Promise.all([
                permissionService.getAllPermissions(filter,skip, limit),
                permissionService.countPermissions(filter)
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
                results: permsListes
            });

        } catch (error) {
            console.log('Erreur lors de la récupération des permissions:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // Methode : Recuperer tous les permissions sans Pagination
    async getAllPermsNoPaginate(req:Request,res:Response){
        try {
            const dataPerms = await permissionService.getAllPermissionsNoPaginate();
            res.status(HTTP_STATUS_OK).json(dataPerms);
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

}