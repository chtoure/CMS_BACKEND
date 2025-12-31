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

            console.log("bonjour", req.body);
            
            const { id } = req.params;
            const { geometry, adjustments, bgRemoved } = req.body;

            const media = await this.mediaService.getMediaById(Number(id));
            if (!media || media.type !== 'image') {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Image source non trouvée" });
            }

            const originalAbsolutePath = path.join(process.cwd(), media.file_path);
            
            // Génération d'un nouveau nom de fichier pour ne pas écraser l'original
            const fileExt = path.extname(media.file_path);
            const fileName = path.basename(media.file_path, fileExt);
            const newFileName = `${fileName}_edited_${Date.now()}${fileExt}`;
            const newRelativePath = path.join('media/uploads/images/', newFileName);
            const newAbsolutePath = path.join(process.cwd(), newRelativePath);

            // 2. Traitement avec Sharp
            let pipeline = sharp(originalAbsolutePath);

            // --- Géométrie ---
            if (geometry) {
                if (geometry.rotation) pipeline = pipeline.rotate(geometry.rotation);
                if (geometry.flipH) pipeline = pipeline.flip();
                if (geometry.flipV) pipeline = pipeline.flop();
                if (geometry.crop) {
                    pipeline = pipeline.extract({
                        left: geometry.crop.x,
                        top: geometry.crop.y,
                        width: geometry.crop.width,
                        height: geometry.crop.height
                    });
                }
            }

            // --- Ajustements ---
            if (adjustments) {
                // Sharp modulate: brightness et saturation sont des multiplicateurs (1.0 = normal)
                pipeline = pipeline.modulate({
                    brightness: adjustments.brightness,
                    saturation: adjustments.saturation
                });

                if (adjustments.grayscale) pipeline = pipeline.grayscale();
                if (adjustments.blur && adjustments.blur > 0) pipeline = pipeline.blur(adjustments.blur);
            }

            // 3. Sauvegarde du nouveau fichier sur le disque
            await pipeline.toFile(newAbsolutePath);

            // 4. Création d'une nouvelle entrée en BDD
            const newMedia = await this.mediaService.createMedia({
                alt: media.alt,
                file_path: newRelativePath.replace(/\\/g, '/'),
                type: 'image'
            });

            return res.status(HTTP_STATUS_OK).json({ 
                message: "Nouvelle image créée avec succès", 
                media: newMedia 
            });

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors du traitement de l'image" });
        }
    }
}




