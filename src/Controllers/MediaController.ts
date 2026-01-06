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


    async getMedias(req: Request, res: Response) {
        try {
            // 1. Récupération des paramètres de pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const filter = req.query.type as 'video' | 'image' | null || null;

            // 2. Appel au service pour les données et le total
            const [mediaList, totalCount] = await Promise.all([
                this.mediaService.getAllMedia(filter, skip, limit),
                this.mediaService.countMedia(filter)
            ]);

            const baseUrl = `${process.env.APP_URL}`;
            const totalPages = Math.ceil(totalCount / limit);

            // 3. Transformation des chemins de fichiers
            const results = mediaList.map((media) => ({
                ...media,
                file_path: `${baseUrl}${media.file_path}`
            }));

            // 4. Construction des URLs Next/Previous (Logique Django)
            const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
            const next = page < totalPages 
                ? `${fullUrl}?page=${page + 1}&limit=${limit}${filter ? `&type=${filter}` : ''}` 
                : null;
            const previous = page > 1 
                ? `${fullUrl}?page=${page - 1}&limit=${limit}${filter ? `&type=${filter}` : ''}` 
                : null;

            // 5. Réponse formatée standardisée
            return res.status(HTTP_STATUS_OK).json({
                count: totalCount,
                next: next,
                previous: previous,
                total_pages: totalPages,
                current_page: page,
                results: results
            });

        } catch (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des médias", 
                details: error 
            });
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

    // MediaController.ts

    async editImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { geometry, adjustments } = req.body;

            console.log(req.body);

            const media = await this.mediaService.getMediaById(Number(id));
            if (!media) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Média non trouvé" });

            const originalAbsolutePath = path.join(process.cwd(), media.file_path);
            
            // 1. Génération du nouveau chemin de fichier
            const fileExt = path.extname(media.file_path);
            const fileName = path.basename(media.file_path, fileExt);
            const newFileName = `${fileName}_edited_${Date.now()}${fileExt}`;
            const newRelativePath = path.join('media/uploads/images/', newFileName).replace(/\\/g, '/');
            const newAbsolutePath = path.join(process.cwd(), newRelativePath);

            let pipeline = sharp(originalAbsolutePath).rotate(); // .rotate() sans argument redresse l'image selon l'EXIF

            if (geometry && geometry.crop) {
                pipeline = pipeline.extract({
                    left: Math.round(geometry.crop.x),
                    top: Math.round(geometry.crop.y),
                    width: Math.round(geometry.crop.width),
                    height: Math.round(geometry.crop.height)
                });
            }

            if (adjustments) {
                pipeline = pipeline.modulate({
                    brightness: adjustments.brightness,
                    saturation: adjustments.saturation
                });
                if (adjustments.grayscale) pipeline = pipeline.grayscale();
                if (adjustments.blur) pipeline = pipeline.blur(adjustments.blur);
            }

            // 3. Sauvegarde physique du nouveau fichier (Correction ici)
            await pipeline.toFile(newAbsolutePath);

            // 4. Création d'une nouvelle entrée en BDD (Correction du file_path)
            const newMedia = await this.mediaService.createMedia({
                alt: `Edited ${media.alt || 'image'}`,
                file_path: newRelativePath, // Pointer vers le NOUVEAU fichier
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




