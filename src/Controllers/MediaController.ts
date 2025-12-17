import type { Request, Response } from "express";
import MediaService from "../Services/MediaService.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";


export default class MediaController {

    private mediaService: MediaService;

    constructor() {
        this.mediaService = new MediaService();
    }

    async getMedia(req:Request,res:Response){

        const id= Number(req.params.id);

        try {

            const media = await this.mediaService.getMediaById(id);

            if (!media) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Média non trouvé" });
            }

            const mediaUrl = `${process.env.APP_URL}` || `${req.protocol}://${req.get('host')}` + `/uploads/${media.file_path}`;
            media.file_path = mediaUrl;

            return res.status(HTTP_STATUS_OK).json(media);

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération du média", details: error });
        }
    }


    async getMedias(req:Request,res:Response){
        try {

            const mediaList = await this.mediaService.getAllMedia();
            const baseUrl = `${process.env.APP_URL}` || `${req.protocol}://${req.get('host')}`;

            const mediaWithUrls = mediaList.map((media) => ({
                ...media,
                file_path: `${baseUrl}${media.file_path}`
            }));

            return res.status(HTTP_STATUS_OK).json(mediaWithUrls);

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération des médias", details: error });
        }
    }

    
    async deleteMedia(req:Request,res:Response){

        const id= Number(req.params.id);
        try {
            const deletedMedia = await this.mediaService.deleteMedia(id);

            if (!deletedMedia) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Média non trouvé" });
            }
        }catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la suppression du média", details: error });
        }
    }


    async createMedia(req:Request,res:Response){

        try {

            if (!req.file) res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Aucun fichier téléchargé" });
            const mediaPayload = req.body;
            const filePath = req.file?.path;

            mediaPayload.file_path = filePath;
            const newMedia =  await this.mediaService.createMedia(mediaPayload);

            res.status(HTTP_STATUS_OK).json(newMedia);

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la création du média", details: error });
        }
    }
}




