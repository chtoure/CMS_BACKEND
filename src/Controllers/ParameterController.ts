import type { Request, Response } from "express";
import ParameterService from "../Services/ParameterService.ts";
import { 
    HTTP_STATUS_OK, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_NOT_FOUND 
} from "../Utils/Constantes/ConstantesHttp.ts";

export default class ParameterController {
    private parameterService: ParameterService;

    constructor() {
        this.parameterService = new ParameterService();
    }

    async getParams(req: Request, res: Response) {
        try {
            const params = await this.parameterService.getParameters();

            if (!params) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Paramètres non configurés" });
            }

            if (params.logo && !params.logo.startsWith('http')) {
                params.logo = `${process.env.APP_URL}${params.logo}`;
            }

            return res.status(HTTP_STATUS_OK).json(params);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des paramètres", 
                details: error 
            });
        }
    }


    async updateParams(req: Request, res: Response) {
        try {
            const payload = req.body;
            
            if (payload.logo && payload.logo.includes(process.env.APP_URL)) {
                payload.logo = payload.logo.replace(process.env.APP_URL, '');
            }

            const updatedParams = await this.parameterService.updateParameters(payload);

            return res.status(HTTP_STATUS_OK).json({
                message: "Paramètres mis à jour avec succès",
                data: updatedParams
            });
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la mise à jour des paramètres", 
                details: error 
            });
        }
    }
}