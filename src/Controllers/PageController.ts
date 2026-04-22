
import PageService from "../Services/PageService.ts";
import type { Request,Response } from "express";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { RequestHelper } from "../Utils/queryFilter.ts";


export default class PageController {
    private pageService: PageService;
    constructor() {
        this.pageService = new PageService();
    }

    public async createPage(req:Request,res:Response){
        console.log("Creation de page", req.body);
        try {
            const data = req.body;
            const page = await this.pageService.createPage({
                ...data,
                userId: req.user?.sub
            });
            return res.status(HTTP_STATUS_CREATED).json(page);
        } catch (error) {
            console.error('Erreur lors de la creation de la revision:', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

     public async getPages(req: Request, res: Response){
        try {
            const filters = RequestHelper.getFilters(req);
            const pages = await this.pageService.getPages(filters);
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


    public async renderFullPage(req:Request,res:Response){
        
        const { slug } = req.params
        try {
            if (!slug) {
                const pageRender = await this.pageService.renderPage("/");
                return res.status(HTTP_STATUS_OK).json(pageRender);
            }
            console.log("Render Full Page HHHHHHHHH", slug)
            const pageRender = await this.pageService.renderPage("/"+slug);
            return res.status(HTTP_STATUS_OK).json(pageRender);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
}
