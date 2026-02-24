

import BlocTemplateService from "../Services/BlocTemplateService.ts";
import type { RegisterBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Request, Response } from "express";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";

export default class BlocTemplateController {
    
    private blocTemplateService:BlocTemplateService;

    constructor(){
        this.blocTemplateService = new BlocTemplateService();
    }

   

    public async createBlocTemplate(req: Request, res: Response){
        try {
            const data = req.body as RegisterBlocTemplate;
            const blocTemplate = await this.blocTemplateService.createBlocTemplate(data);
            return res.status(HTTP_STATUS_CREATED).json(blocTemplate);
        } catch (error: any) {
            console.log(error);
            // const errorMessage = handlePrismaError(error);
            console.log(error.message);
            
            return res.status(getErrorStatus(error)).json({ message: error.message });
        }
    }

    public async getBlocTemplates(req: Request, res: Response){
        try {
            const blocTemplates = await this.blocTemplateService.getBlocTemplates(req.query);
            return res.status(HTTP_STATUS_OK).json(blocTemplates);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getBlocTemplateById(req: Request, res: Response){
        try {
            const blocTemplate = await this.blocTemplateService.getBlocTemplateById(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(blocTemplate);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    // Rendu d'un arbre de section
    public async getTreeSection(req: Request, res: Response){
        try {
            const blocTemplates = await this.blocTemplateService.getTreeSection(Number(req.params.sectionId));
            return res.status(HTTP_STATUS_OK).json(blocTemplates);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getBlocTemplatesCustom(req: Request, res: Response){
        try {
            const blocTemplates = await this.blocTemplateService.getBlocTemplatesCustom();
            
            return res.status(HTTP_STATUS_OK).json(blocTemplates);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }


    public async updateBlocTemplate(req: Request, res: Response){
        try {
            const blocTemplate = await this.blocTemplateService.updateBlocTemplate(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(blocTemplate);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deleteBlocTemplate(req: Request, res: Response){
        try {
            const blocTemplate = await this.blocTemplateService.deleteBlocTemplate(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(blocTemplate);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }    
    
}