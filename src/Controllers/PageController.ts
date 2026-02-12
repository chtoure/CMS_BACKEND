
import PageService from "../Services/PageService.ts";
import type { Request,Response } from "express";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";


export default class PageController {
    private pageService: PageService;
    constructor() {
        this.pageService = new PageService();
    }

    public async createPage(req:Request,res:Response){
        try {
            const data = req.body;
            const page = await this.pageService.createPage(data);
            return res.status(HTTP_STATUS_CREATED).json(page);
        } catch (error) {
            console.error('Erreur lors de la creation de la revision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

     public async getPages(req: Request, res: Response){
        try {
            const pages = await this.pageService.getPages(req.query);
            return res.status(HTTP_STATUS_OK).json(pages);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getPageById(req: Request, res: Response){
        try {
            const page = await this.pageService.getPageById(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(page);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updatePage(req: Request, res: Response){
        try {
            const page = await this.pageService.updatePage(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(page);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deletePage(req: Request, res: Response){
        try {
            const page = await this.pageService.deletePage(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(page);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
}
