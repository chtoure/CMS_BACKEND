
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import RoleService from "../Services/RoleService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { RequestHelper } from "../Utils/queryFilter.ts";


const roleService = new RoleService();


export default class RoleController {

    // Methode : creation d'un role
    async createRole(req:Request,res:Response){

        const {name,description, permissionIds} = req.body;
        try {

            let role; 

            if (!permissionIds || permissionIds.length == 0 ) {
                role = await roleService.createRole({name,description});
                return res.status(HTTP_STATUS_CREATED).json(role);
            }

            role = await roleService.createRole({name,description},permissionIds);
            return res.status(HTTP_STATUS_CREATED).json(role);
        } catch (error) {
            console.error('Erreur lors de la creation d\'un role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }

    }

    // Methode : Recuperer tous les roles
    async getRoles(req:Request,res:Response){
        try {
            const filter = RequestHelper.getFilters(req);
            const roles = await roleService.getRoles(filter);
            return res.status(HTTP_STATUS_OK).json(roles);
        } catch (error) {
            console.error('Erreur lors de la recuperation des roles', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }




    // Methode : Recuperer un role par son id
    async getRoleById(req:Request,res:Response){
        try {
            const role =await roleService.getRoleById(Number(req.params.id));
           return res.status(HTTP_STATUS_OK).json(role);
        } catch (error) {
            console.log('Erreur lors de la récupération d\'un role:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }



    // Methode : Modifier un role
    async updateRole(req:Request,res:Response){

        const {name,description, permissionIds} = req.body;
        try {
            let roleUpdated;

            if (!permissionIds || permissionIds.length == 0 ) {
                roleUpdated= await roleService.updateRole(Number(req.params.id),{name,description});
                return res.status(HTTP_STATUS_OK).json(roleUpdated);
            }

            roleUpdated = await roleService.updateRole(Number(req.params.id),{name,description},permissionIds);
            return res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors de la modification d\'un role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }



    // Methode : Archiver un role
    async deleteRole(req:Request,res:Response){
        try {
            const deletedRole = await roleService.deleteRole(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(deletedRole);
        } catch (error) {
            console.log('Erreur lors de la suppression d\'un role:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // Methode : Restorer un role
    async restoreRole(req:Request,res:Response){
        try {
            const deletedRole = await roleService.restoreRole(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(deletedRole);
        } catch (error) {
            console.log('Erreur lors de la restauration d\'un role:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    //Methode: Ajouter des ou une permission(s) a un role deja existant
    async addPermissionsToRole(req:Request,res:Response){

        const {permissionIds} = req.body;
        try {

            if (!permissionIds || permissionIds.length == 0 ) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'Aucune permission fournie pour l\'ajout au role' });
            }

            const roleExistant = await roleService.getRoleById(Number(req.params.id));
            if (!roleExistant) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Role non existant ou archiver' });
            }

            const roleUpdated = await roleService.addPermissionsToRole(roleExistant.id,req.body.permissionIds);
            return res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de permissions a un role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // Methode: Retirer une permission d'un role
    async removePermissionFromRole(req:Request,res:Response){

        const {permissionId} = req.body;
        try {

            const roleExistant = await roleService.getRoleById(Number(req.params.id));
            if (!roleExistant) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Role non existant ou archiver' });
            }

            const roleUpdated = await roleService.removePermissionFromRole(roleExistant.id,permissionId);
            return res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors du retrait de la permission du role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    //  Methode: Restorer une permission d'un role
     async restorePermissionFromRole(req:Request,res:Response){

        const {permissionId} = req.body;
        try {

            const roleExistant = await roleService.getRoleById(Number(req.params.id));
            if (!roleExistant) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Role non existant ou archiver' });
            }

            const roleUpdated = await roleService.restorePermissionFromRole(roleExistant.id,permissionId);
            return res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors du restore de la permission du role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    // recuperer les permission d'un role by id
    async getPermissionByRoleId(req:Request,res:Response){
        try {
            const permissions = await roleService.getPermissions(Number(req.params.id));
            if (!permissions) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Cet Role n'a pas de permissions" });
            }
            return res.status(HTTP_STATUS_OK).json(permissions);
        } catch (error) {
            console.error('Erreur lors de la recuperation des permission du role', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    

}