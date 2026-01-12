
import type { Request, Response } from 'express';
import ContentEntryService from '../Services/ContentEntryService.ts';
import ContentTypeService from '../Services/ContentTypeService.ts';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from '../Utils/Constantes/ConstantesHttp.ts';
import type { ContentType } from '../Types/ContentType.ts';


const entryService = new ContentEntryService();
const contentTypeService = new ContentTypeService();

export class ContentEntryController {


    static async validateSlug(slug: string | undefined, res: Response): Promise<ContentType | null> {
        
        if (!slug) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
            return null;
        }

        const contentType = await contentTypeService.getContentTypeBySlug(slug);

        return contentType;
    }



    // GET  /api/content/:slug
    public async getAllEntries(req: Request, res: Response) {
        try {

            const { slug } = req.params;

            // Validation slug
            const contentTypeValidate = await ContentEntryController.validateSlug(slug,res);

            if (!contentTypeValidate) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });
           
            // On récupère les entrées liées à ce ContentType ID
            const entries = await entryService.getContentEntriesByContentTypeID(contentTypeValidate.id);
            
            return res.status(HTTP_STATUS_OK).json({
                contentType: contentTypeValidate.name,
                schema: contentTypeValidate.fields_schema, // Utile pour que le front sache quoi afficher
                data: entries
            });
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


   
    // get entry by id /api/content/:slug/:id
    public async getEntry(req: Request, res: Response) {
        try {

            const { slug ,id } = req.params;

            // Validation slug
            const contentTypeValidate = await ContentEntryController.validateSlug(slug,res);

            if (!contentTypeValidate) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });
            
            const entry = await entryService.getContentEntryById(Number(id),contentTypeValidate.id);

            if (!entry) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: `Entry '${slug}' est inconnu. ou archiver` });
            
            return res.status(HTTP_STATUS_OK).json({
                contentType: contentTypeValidate.name,
                schema: contentTypeValidate.fields_schema, // Utile pour que le front sache quoi afficher
                data: entry
            });
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }



    // POST /api/content/:slug
    public async createEntry(req: Request, res: Response) {
        try {
            const { slug } = req.params;

            // Validation slug
            const contentType = await ContentEntryController.validateSlug(slug,res);

            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });

            // On ajoute l'ID du type de contenu à la donnée
            const newEntry = await entryService.createContentEntry({
                ...req.body,
                contentTypeId: contentType.id
            });

            return res.status(HTTP_STATUS_CREATED).json(newEntry);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    // update Entry PUT /api/content/:slug/:id
    public async updateContentEntry(req: Request, res: Response) {
        try {

            const { slug, id } = req.params;

            // Validation slug
            const contentType = await ContentEntryController.validateSlug(slug,res);

            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });

        
            const result = await entryService.updateContentEntry(Number(id), contentType.id, req.body);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {           
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la mise à jour d'un entry", details: error });
        }
    }



     // archiver contentType PUT /api/archiveContentEntry/:slug/:id
    public async archivedContentEntry(req:Request,res:Response){
        try {

            const { slug } = req.params;

            // Validation slug
            const contentType = await ContentEntryController.validateSlug(slug,res);

            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le contenu de type '${slug}' est inconnu ou archivé.` });
            
            res.status(HTTP_STATUS_OK).json(contentType);

        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de l'archivage d'un contenType", details: error });
        }
    }


    // restorer un contentType archivés
    public async restoreContentType(req:Request,res:Response){

        try {            
            const content = await contentTypeService.restoredContentType(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(content);
        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la restoration d'un contentType", details: error });
        }
    }


    // delete contentType archiver
    public async deleteContentTypeArchived(req:Request,res:Response){
        try {

            const contentDelete = await contentTypeService.deleteContentType(Number(req.params.id));
            if(!contentDelete) res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou non archivé' });
            res.status(HTTP_STATUS_OK).json(contentDelete);

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression d'un contentType", details: error });
        }
    }

}