import type { Request, Response } from "express";
import MediaService from "../Services/MediaService.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { deleteFile } from "../Utils/file.ts";
import path from "path";
import fs from "fs";
import sharp from "sharp";


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

            const mediaUrl = `${process.env.APP_URL}${media.file_path}`;
            media.file_path = mediaUrl;

            return res.status(HTTP_STATUS_OK).json(media);

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération du média", details: error });
        }
    }


    async getMedias(req:Request,res:Response){
        try {

            const filter=req.query.type as 'video' | 'image' | null || null;
            
            const mediaList = await this.mediaService.getAllMedia(filter);
            const baseUrl = `${process.env.APP_URL}`;

            const mediaWithUrls = mediaList.map((media) => ({
                ...media,
                file_path: `${baseUrl}${media.file_path}`
            }));

            return res.status(HTTP_STATUS_OK).json(mediaWithUrls);

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération des médias", details: error });
        }
    }

    
    async deleteMedia(req: Request, res: Response) {
        const id = Number(req.params?.id);
        let ids = req.body?.ids as number[] | undefined;

        try {
            if (!isNaN(id)) {
                ids = [id];
            } else if (!(ids && Array.isArray(ids))) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "ID de média invalide" });
            }

            const mediasToDelete = await this.mediaService.getMediaByIds(ids);

            if (!mediasToDelete || mediasToDelete.length === 0) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Aucun média trouvé" });
            }

            mediasToDelete.forEach((media) => {
                deleteFile(media.file_path);
            });

            const result = await this.mediaService.deleteMedias(ids);

            return res.status(HTTP_STATUS_OK).json({ 
                message: `${result} média(s) supprimé(s) (BDD + Disque).` 
            });

        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la suppression", 
                details: error 
            });
        }
    }

    async createMedia(req:Request,res:Response){

        try {

            if (!req.file) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Aucun fichier téléchargé" });

            const mediaPayload = req.body;

            if (req.file.mimetype.startsWith('image/')) {
                mediaPayload.file_path = 'media/uploads/images/' + req.file?.filename;
                mediaPayload.type = 'image';
            }else{
                mediaPayload.file_path = 'media/uploads/videos/' + req.file?.filename;
                mediaPayload.type = 'video';
            }

            
            
            const newMedia =  await this.mediaService.createMedia(mediaPayload);
            
            return res.status(HTTP_STATUS_OK).json(newMedia);

        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la création du média", details: error });
        }
    }

    async editImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { resize, grayscale, blur, sharpen, tint } = req.body;

            const media = await this.mediaService.getMediaById(Number(id));
            if (!media || media.type !== 'image') {
                return res.status(404).json({ error: "Image non trouvée" });
            }

            const absolutePath = path.join(process.cwd(), media.file_path);
            const tempPath = absolutePath + '.tmp'; 

            let pipeline = sharp(absolutePath);

            pipeline = pipeline.rotate(); 

            if (resize) {
                pipeline = pipeline.resize({
                    width: resize.width,
                    height: resize.height,
                    fit: 'cover',
                    withoutEnlargement: true
                });
            }

            if (grayscale) pipeline = pipeline.grayscale();
            if (blur && blur > 0) pipeline = pipeline.blur(blur);
            if (sharpen) pipeline = pipeline.sharpen();
            
            if (tint) {
                pipeline = pipeline.tint({ r: tint.r, g: tint.g, b: tint.b });
            }
            
            await pipeline.toFile(tempPath);
            fs.renameSync(tempPath, absolutePath);

            return res.status(200).json({ message: "Image modifiée avec succès" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erreur lors du traitement de l'image" });
        }
    }
}




