
import SectionService from "../Services/SectionService.ts";
import type { Request, Response } from "express";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";


export default class SectionController {
    
    private sectionService: SectionService;

    constructor(){
        this.sectionService = new SectionService();
    }

    public async createSection(req: Request, res: Response){
        try {
            const section = await this.sectionService.createSection(req.body);
            return res.status(HTTP_STATUS_CREATED).json(section);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getSections(req: Request, res: Response){
        try {
            const sections = await this.sectionService.getSections(req.query);
            return res.status(HTTP_STATUS_OK).json(sections);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    // Rendu d'une page complete
    public async getFullPage(req: Request, res: Response){
        try {
            const section = await this.sectionService.renderPage(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(section);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getSectionById(req: Request, res: Response){
        try {
            const section = await this.sectionService.getSectionById(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(section);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updateSection(req: Request, res: Response){
        try {
            const section = await this.sectionService.updateSection(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(section);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deleteSection(req: Request, res: Response){
        try {
            const section = await this.sectionService.deleteSection(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(section);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }    
    
}