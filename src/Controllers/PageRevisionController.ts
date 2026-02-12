
import type { Request,Response } from "express";
import PageRevisionService from "../Services/PageRevision.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";


export default class PageRevisionController {
    private pageRevisionService: PageRevisionService;
    constructor() {
        this.pageRevisionService = new PageRevisionService();
    }

    public async createPageRevision(req:Request,res:Response){
        const {pageId} = req.params;
        try {
            const pageRevision = await this.pageRevisionService.createPageRevision({pageId: Number(pageId)});
            return res.status(HTTP_STATUS_CREATED).json(pageRevision);
        } catch (error) {
            console.log('Erreur lors de la creation de la pageRevision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getPageRevisions(req: Request, res: Response){
        try {
            const pageRevisions = await this.pageRevisionService.getPageRevisions(req.query);
            return res.status(HTTP_STATUS_OK).json(pageRevisions);
        } catch (error) {
            console.log('Erreur lors de la recuperation des pageRevisions:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getPageRevisionById(req: Request, res: Response){
        try {
            const pageRevision = await this.pageRevisionService.getPageRevisionById(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(pageRevision);
        } catch (error) {
            console.log('Erreur lors de la recuperation de la pageRevision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updatePageRevision(req: Request, res: Response){
        try {
            const pageRevision = await this.pageRevisionService.updatePageRevision(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(pageRevision);
        } catch (error) {
            console.log('Erreur lors de la mise a jour de la pageRevision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deletePageRevision(req: Request, res: Response){
        try {
            const pageRevision = await this.pageRevisionService.deletePageRevision(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(pageRevision);
        } catch (error) {
            console.error('Erreur lors de la suppression de la pageRevision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
}
