
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import RoleService from "../Services/RoleService.ts";


const roleService = new RoleService();


export default class RoleController {

    // Methode : creation d'un role
    async createRole(req:Request,res:Response){

        const {name,description, permissionIds} = req.body;
        try {

            let role; 

            if (!permissionIds || permissionIds.length == 0 ) {
                role = await roleService.createRole({name,description});
                res.status(HTTP_STATUS_CREATED).json(role);
            }

            role = await roleService.createRole({name,description},permissionIds);
            res.status(HTTP_STATUS_CREATED).json(role);
        } catch (error) {
            console.error('Erreur lors de la creation d\'un role', error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la creation d\'un role.' });
        }

    }



    // Methode : Recuperer tous les roles
    async getAllRoles(req:Request,res:Response){
        try {
            // Calculs de base pour la pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            // Appel simultané pour les données et le total
            const [roleList, totalCount] = await Promise.all([
                roleService.getAllRoles(skip, limit),
                roleService.countRoles()
            ]);

            const totalPages = Math.ceil(totalCount / limit);
            const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            // Construction des liens de navigation
            const next = page < totalPages 
                ? `${fullUrl}?page=${page + 1}&limit=${limit}` 
                : null;
                
            const previous = page > 1 
                ? `${fullUrl}?page=${page - 1}&limit=${limit}` 
                : null;

            // Réponse structurée
            return res.status(HTTP_STATUS_OK).json({
                count: totalCount,
                next: next,
                previous: previous,
                total_pages: totalPages,
                current_page: page,
                results: roleList
            });

        } 
        catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération d\'un role', details: error });
        }
    }


    // Methode : Recuperer tous les roles sans Pagination
    async getAllRolesNoPaginate(re:Request,res:Response){
        try {
            const roles = await roleService.getAllRolesNoPaginate();
            res.status(HTTP_STATUS_OK).json(roles);
        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération d\'un role', details: error });
        }
    }


    // Methode : Recuperer un role par son id
    async getRoleById(req:Request,res:Response){
        try {
            const role =await roleService.getRoleById(Number(req.params.id));
           res.status(HTTP_STATUS_OK).json(role);
        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération d\'un role', details: error });
        }
    }



    // Methode : Modifier un role
    async updateRole(req:Request,res:Response){

        const {name,description, permissionIds} = req.body;
        try {
            let roleUpdated;

            if (!permissionIds || permissionIds.length == 0 ) {
                roleUpdated= await roleService.updateRole(Number(req.params.id),{name,description});
                res.status(HTTP_STATUS_OK).json(roleUpdated);
            }

            roleUpdated = await roleService.updateRole(Number(req.params.id),{name,description},permissionIds);
            res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors de la modification d\'un role', error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la modification d\'un role.' });
        }
    }



    // Methode : Supprimer un role
    async deleteRole(req:Request,res:Response){
        try {
            const deletedRole = await roleService.deleteRole(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(deletedRole);
        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression de role", details: error });
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
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Role non existant' });
            }

            const roleUpdated = await roleService.addPermissionsToRole(roleExistant.id,req.body.permissionIds);
            res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de permissions a un role', error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de l\'ajout de permissions a un role.' });
        }
    }


    // Methode: Retirer une permission d'un role
    async removePermissionFromRole(req:Request,res:Response){

        const {permissionId} = req.body;
        try {

            const roleExistant = await roleService.getRoleById(Number(req.params.id));
            if (!roleExistant) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Role non existant' });
            }

            const roleUpdated = await roleService.removePermissionFromRole(roleExistant.id,permissionId);
            res.status(HTTP_STATUS_OK).json(roleUpdated);
        } catch (error) {
            console.error('Erreur lors du retrait de la permission du role', error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors du retrait de la permission du role.' });
        }
    }

    // recuperer les permission d'un role by id
    async getPermissionByRoleId(req:Request,res:Response){
        try {
            const permissions = await roleService.getPermissions(Number(req.params.id));
            if (!permissions) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Cet Role n'a pas de permissions" });
            }
            res.status(HTTP_STATUS_OK).json(permissions);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la recuperation des permission du role.' });
        }
    }

}