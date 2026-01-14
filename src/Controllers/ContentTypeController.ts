
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import ContentTypeService from "../Services/ContentTypeService.ts";


// Initialisation
const contentTypeService = new ContentTypeService()


export default class ContentTypeController {


    public async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await contentTypeService.createContentType(data);
            return res.status(HTTP_STATUS_CREATED).json(result);
        } catch (error: any) {
            console.log(error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    public async getContentTypes(req:Request, res:Response){

       try {

            // Calculs de base pour la pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            // Appel simultané pour les données et le total
            const [contentTypeList, totalCount] = await Promise.all([
                contentTypeService.getAllContentTypes(skip, limit),
                contentTypeService.countContentTypes()
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
                results: contentTypeList
            });

        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des des contentTypes", 
                details: error 
            });
        }

    }


    public async getContentTypesNoPaginate(req:Request,res:Response){
        try {
            const contents = await contentTypeService.getAllContentsNoPaginate();
            return res.status(HTTP_STATUS_OK).json(contents)
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des des contentTypes", 
                details: error 
            });
        }
    }


    public async getContentTypeById(req:Request,res:Response){

        try {
            
            const contentType = await contentTypeService.getContentTypeById(Number(req.params.id));
            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou archivé' });
            return res.status(HTTP_STATUS_OK).json(contentType);

        } catch (error) {
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la récupération de ContententType", details: error });
        }

    }


    public async getContentTypeBySlug(req:Request,res:Response){
         const {slug}= req.params
        try {

            if (!slug) {
                res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
                return null;
            }
    
            const contentTypeSlug = await contentTypeService.getContentTypeBySlug(slug);
            if (!contentTypeSlug) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou archivé' });
             res.status(HTTP_STATUS_OK).json(contentTypeSlug);

        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération de ContententType", details: error });
        }
    }


    public async updateContentType(req: Request, res: Response) {
        try {
           
            const result = await contentTypeService.updateContentType(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {           
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la mise à jour de l'utilisateur", details: error });
        }
    }


    // archiver contentType
    public async archivedContentType(req:Request,res:Response){
        try {
            const contentType = await contentTypeService.archivedContentType(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(contentType);

        } catch (error) {
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de l'archivage d'un contenType", details: error });
        }
    }


    // restorer un contentType archivés
    public async restoreContentType(req:Request,res:Response){

        try {            
            const content = await contentTypeService.restoredContentType(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(content);
        } catch (error) {
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la restoration d'un contentType", details: error });
        }
    }


    // delete contentType archiver
    public async deleteContentTypeArchived(req:Request,res:Response){
        try {

            const contentDelete = await contentTypeService.deleteContentType(Number(req.params.id));
            if(!contentDelete) res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou non archivé' });
            res.status(HTTP_STATUS_OK).json(contentDelete);

        } catch (error) {
           return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression d'un contentType", details: error });
        }
    }

}