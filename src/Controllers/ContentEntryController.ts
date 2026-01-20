
import type { Request, Response } from 'express';
import ContentEntryService from '../Services/ContentEntryService.ts';
import ContentTypeService from '../Services/ContentTypeService.ts';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from '../Utils/Constantes/ConstantesHttp.ts';
import type { ContentType } from '../Types/ContentType.ts';

const contentEntryService = new ContentEntryService();
const contentTypeService = new ContentTypeService();

export default class ContentEntryController {


    static async validateSlug(slug: string | undefined, res: Response): Promise<ContentType | null> {
        
        if (!slug) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
            return null;
        }

        const contentType = await contentTypeService.getContentTypeBySlug(slug);

        return contentType;
    }



    // GET  /content/:slug
    public async getAllEntries(req: Request, res: Response) {
        try {

            const { slug } = req.params;

            const contentTypeValidate = await ContentEntryController.validateSlug(slug,res);

            if (!contentTypeValidate) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });
           
            // On récupère les entrées liées à ce ContentType ID
            const entries = await contentEntryService.getContentEntriesByContentTypeID(contentTypeValidate.id);
            
            return res.status(HTTP_STATUS_OK).json({
                contentType: contentTypeValidate.name,
                schema: contentTypeValidate.fields_schema, // Utile pour que le front sache quoi afficher
                data: entries
            });
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async getAllContentEntry(req: Request, res: Response) {
        try {
            const entries = await contentEntryService.getAllContentEntry();
            return res.status(HTTP_STATUS_OK).json(entries);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async getAllContentEntryNoPaginate(req: Request, res: Response) {
        try {
            const entries = await contentEntryService.getAllContentEntryNoPaginate();
            return res.status(HTTP_STATUS_OK).json(entries);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async getContentEntriesByContentTypeID(req: Request, res: Response) {
        try {

            const filterStatus = req.query.status as "PUBLISHED" | "DRAFT" | "ARCHIVED" | undefined;
            const filterSearch = req.query.search as string | undefined;
            const filterPage = Number(req.query.page) || 1;
            const filterLimit = Number(req.query.limit) || 10;

            const skip = (filterPage - 1) * filterLimit;
            const limit = filterLimit;

            const entries = await contentEntryService.getContentEntriesByContentTypeID(
                Number(req.params.id),
                skip,
                limit,
                filterStatus,
                filterSearch
            );

            return res.status(HTTP_STATUS_OK).json(entries);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


   
    // get entry by id /content/:slug/:id
    public async getEntry(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const entry = await contentEntryService.getContentEntryById(Number(id));

            if (!entry) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: `Entry '${id}' est inconnu. ou archiver` });
            
            return res.status(HTTP_STATUS_OK).json(entry);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }



    // POST /content/:slug
    public async createEntry(req: Request, res: Response) {
        try {
            const { slug } = req.params;

            const userId = req.user?.sub;

            const contentType = await ContentEntryController.validateSlug(slug,res);

            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu ou archivé.` });

            // On ajoute l'ID du type de contenu à la donnée
            const newEntry = await contentEntryService.createContentEntry({
                ...req.body,
                userId,
                contentTypeId: contentType.id
            });

            return res.status(HTTP_STATUS_CREATED).json(newEntry);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    // update Entry PUT /content/:slug/:id
    public async updateContentEntry(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const result = await contentEntryService.updateContentEntry(Number(id), req.body);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {           
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la mise à jour d'un entry", details: error });
        }
    }


    public async updateStatus(req: Request, res:Response){
        try {

            const {id} = req.params;

            if (id == undefined) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({error: "Contenu non trouver"})
            }
            const {status} = req.body as {status: "PUBLISHED" | "DRAFT" | "ARCHIVED"};

            console.log(status);
            
            const result = contentEntryService.updateStatus(parseInt(id), status)

            console.log((await result).status);
            
            return res.status(HTTP_STATUS_OK).json(result);
            
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({error:"Erreur lors de la modification du status"})
        }
    }



     // archiver contentType PUT /archiveContentEntry/:slug/:id
    public async archivedContentEntry(req:Request,res:Response){
        try {

            const { id } = req.params;

            const contentEntryArchive = await contentEntryService.archivedContentEntry(Number(id));
            
            res.status(HTTP_STATUS_OK).json(contentEntryArchive);

        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de l'archivage d'un contentEntry", details: error });
        }
    }


    public async restoreContentType(req:Request,res:Response){

        try {       
            
            const {id } = req.params;

            const content = await contentEntryService.restoredContentEntry(Number(id));
            res.status(HTTP_STATUS_OK).json(content);
        } catch (error) {
             res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la restoration d'un contentEntry", details: error });
        }
    }

    public async deletecontentEntry(req:Request,res:Response){
        try {

            const { id } = req.params;

            const entryDelete = await contentEntryService.deleteContentEntry(Number(id));
            if(!entryDelete) res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou non archivé' });
            res.status(HTTP_STATUS_OK).json(entryDelete);

        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la suppression d'un contentEntry", details: error });
        }
    }

    public async getAllArchivedContentEntry(req:Request,res:Response){
        try {
            const filterSearch = req.query.search as string | undefined;
            const filterPage = Number(req.query.page) || 1;
            const filterLimit = Number(req.query.limit) || 10;

            const skip = (filterPage - 1) * filterLimit;
            const limit = filterLimit;


            const content = await contentEntryService.getArchivedContentEntry(skip,limit,filterSearch);
            res.status(HTTP_STATUS_OK).json(content);
        } catch (error) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Erreur lors de la récupération d'un contentEntry", details: error });
        }
    }

}