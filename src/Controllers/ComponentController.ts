import type { Request, Response } from "express";
import ComponentService from "../Services/ComponentService.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";



export default class ComponentController {

    private componentService: ComponentService;

    constructor() {
        this.componentService = new ComponentService();
    }
    

    public async createComponent(req: Request, res: Response){        
        try {
            const components = await this.componentService.createComponents(req.body);
            res.status(HTTP_STATUS_CREATED).json(components);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getComponents(req: Request, res: Response) {
        try {
            const components = await this.componentService.getComponents(req.query);
            res.status(HTTP_STATUS_OK).json(components);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getComponentById(req: Request, res: Response) {
        try {
            const component = await this.componentService.getComponentById(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(component);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getComponentByTag(req: Request, res: Response) {
        const {tag} = req.params
        try {
            if (!tag) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre tag est manquant." });
            const component = await this.componentService.getComponentByTag(tag);
            res.status(HTTP_STATUS_OK).json(component);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updateComponent(req: Request, res: Response) {
        try {
            const component = await this.componentService.updateComponent(Number(req.params.id), req.body);
            res.status(HTTP_STATUS_OK).json(component);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deleteComponent(req: Request, res: Response) {
        try {
            const component = await this.componentService.deleteComponent(Number(req.params.id));
            res.status(HTTP_STATUS_OK).json(component);
        } catch (error) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
    
}   