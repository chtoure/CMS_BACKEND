import type { Request, Response } from "express";
import ParameterService from "../Services/ParameterService.ts";
import { 
    HTTP_STATUS_OK, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_NOT_FOUND 
} from "../Utils/Constantes/ConstantesHttp.ts";
import MediaService from "../Services/MediaService.ts";

export default class ParameterController {
    private parameterService: ParameterService;
    private mediaService: MediaService;

    constructor() {
        this.parameterService = new ParameterService();
        this.mediaService = new MediaService();
    }

    async getParams(req: Request, res: Response) {
        try {
            const params = await this.parameterService.getParameters();

            if (!params) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Paramètres non configurés" });
            }

            if (params.media) {
                params.media.file_path = `${process.env.APP_URL}${params.media.file_path}`;
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


            const mediaId = payload.mediaId;

            const media = await this.mediaService.getMediaById(mediaId);

            if (!media || (media.type !== 'image' && media.type !== 'video')) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Media non trouvé ou type non valide" });
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