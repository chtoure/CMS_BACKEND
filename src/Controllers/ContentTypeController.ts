
import type { Request,Response } from "express";
import { HTTP_STATUS_BAD_REQUEST,HTTP_STATUS_CREATED,HTTP_STATUS_INTERNAL_SERVER_ERROR,HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import ContentTypeService from "../Services/ContentTypeService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { RequestHelper } from "../Utils/queryFilter.ts";
import type { IFieldDefinition } from "../Types/InputField.ts";
import ContentEntryService from "../Services/ContentEntryService.ts";

// Initialisation
const contentTypeService = new ContentTypeService()
const contentEntryService = new ContentEntryService()


export default class ContentTypeController {


    public async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await contentTypeService.createContentType(data);
            //sync relations
            await contentTypeService.syncRelationsContentTypeCreate(result.id,result.fields_schema);
            return res.status(HTTP_STATUS_CREATED).json(result);
        } catch (error: any) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    public async getAllContentTypes(req:Request,res:Response){
        try {
            const filter = RequestHelper.getFilters(req)
            const contentTypes = await contentTypeService.getContentTypes(filter);
            return res.status(HTTP_STATUS_OK).json(contentTypes);
        } catch (error) {
            console.log('Erreur lors de la récupération des contentTypes:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    public async getContentTypeById(req:Request,res:Response){

        try {
            
            const contentType = await contentTypeService.getContentTypeById(Number(req.params.id));
            if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou archivé' });
            return res.status(HTTP_STATUS_OK).json(contentType);

        } catch (error) {
            console.log('Erreur lors de la récupération de ContententType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
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
            console.log('Erreur lors de la récupération de ContententType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    public async getContentTypesExcepted(req:Request,res:Response){
        try {
            const contentTypes = await contentTypeService.getContentTypesExcepted(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(contentTypes);
        } catch (error) {
            console.log('Erreur lors de la récupération de ContententType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    public async updateContentType(req: Request, res: Response) {

        const { fields_schema } = req.body

        try {
           
            const ancienContent = await contentTypeService.getContentTypeById(Number(req.params.id));
            if (!ancienContent) return res.status(HTTP_STATUS_NOT_FOUND).json({"message":"content non trouver"})

            const resultContent = await contentTypeService.updateContentType(Number(req.params.id), req.body);
            //sync relations
            await contentTypeService.syncRelationsContentTypeUpdate(resultContent.id,resultContent.fields_schema);
            
            const { results: entries }= await contentEntryService.getEntries(resultContent.id)
                        
            if (entries.length > 0) {
                await contentTypeService.logiqueModContentType(fields_schema,ancienContent.fields_schema,resultContent.id)
            }
            return res.status(HTTP_STATUS_OK).json(resultContent);
        } catch (error: any) {           
            console.log('Erreur lors de la mise à jour de l\'utilisateur:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // archiver contentType
    public async archivedContentType(req:Request,res:Response){
        try {
            const contentType = await contentTypeService.archivedContentType(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(contentType);

        } catch (error) {
            console.log('Erreur lors de l\'archivage d\'un contenType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // restorer un contentType archivés
    public async restoreContentType(req:Request,res:Response){

        try {            
            const content = await contentTypeService.restoredContentType(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(content);
        } catch (error) {
            console.log('Erreur lors de la restauration d\'un contentType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // delete contentType archiver
    public async deleteContentTypeArchived(req:Request,res:Response){
        try {

            const contentDelete = await contentTypeService.deleteContentType(Number(req.params.id));
            if(!contentDelete) res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'ContententType non trouvé ou non archivé' });
            res.status(HTTP_STATUS_OK).json(contentDelete);

        } catch (error) {
            console.log('Erreur lors de la suppression d\'un contentType:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


}