import type { Request, Response } from "express";
import MediaService from "../Services/MediaService.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import { deleteFile } from "../Utils/file.ts";
import path from "path";
import sharp from "sharp";
import { RequestHelper } from "../Utils/queryFilter.ts";

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
            const filters = RequestHelper.getFilters(req);

            const mediaList = await this.mediaService.getAllMedia(filters);

            const baseUrl = `${process.env.APP_URL}`;

            const results = mediaList.results.map((media) => ({
                ...media,
                file_path: `${baseUrl}${media.file_path}`
            }));

            const paginateData={...mediaList,results};

            return res.status(HTTP_STATUS_OK).json(paginateData);

        } catch (error) {

            console.log(error);
            
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

async createMedia(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Aucun fichier téléchargé" });
        }

        const mediaPayload = req.body;
        const mimetype = req.file.mimetype;
        const filename = req.file.filename;

        /**
         * Détermination dynamique du chemin et du type
         * basée sur la logique du middleware Multer
         */
        if (mimetype.startsWith('image/')) {
            mediaPayload.file_path = `media/uploads/images/${filename}`;
            mediaPayload.type = 'image';
        } 
        else if (mimetype.startsWith('video/')) {
            mediaPayload.file_path = `media/uploads/videos/${filename}`;
            mediaPayload.type = 'video';
        } 
        else if (
            mimetype.includes('pdf') || 
            mimetype.includes('msword') || 
            mimetype.includes('officedocument') ||
            mimetype.startsWith('text/')
        ) {
            mediaPayload.file_path = `media/uploads/documents/${filename}`;
            mediaPayload.type = 'document';
        } 
        else if (
            mimetype.includes('zip') || 
            mimetype.includes('x-rar') || 
            mimetype.includes('tar') || 
            mimetype.includes('compressed')
        ) {
            mediaPayload.file_path = `media/uploads/archives/${filename}`;
            mediaPayload.type = 'archive';
        } 
        else {
            // Sécurité pour les fichiers non classés (dossier 'others' dans Multer)
            mediaPayload.file_path = `media/uploads/others/${filename}`;
            mediaPayload.type = 'other';
        }

        // Sauvegarde en base de données
        const newMedia = await this.mediaService.createMedia(mediaPayload);
        
        return res.status(HTTP_STATUS_OK).json(newMedia);

    } catch (error) {
        console.error("CreateMedia Error:", error);
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
            error: "Erreur lors de la création du média", 
            details: error instanceof Error ? error.message : error 
        });
    }
}

    async editImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { geometry, adjustments } = req.body;

            const media = await this.mediaService.getMediaById(Number(id));
            if (!media) {
                return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Média non trouvé" });
            }

            const originalAbsolutePath = path.join(process.cwd(), media.file_path);
            const fileExt = path.extname(media.file_path);
            const fileName = path.basename(media.file_path, fileExt);
            const newFileName = `${fileName}_edited_${Date.now()}${fileExt}`;
            const newRelativePath = path.join('media/uploads/images/', newFileName).replace(/\\/g, '/');
            const newAbsolutePath = path.join(process.cwd(), newRelativePath);

            let pipeline = sharp(originalAbsolutePath).rotate(); 

            if (geometry && geometry.crop) {
                pipeline = pipeline.extract({
                    left: Math.max(0, Math.round(geometry.crop.x)),
                    top: Math.max(0, Math.round(geometry.crop.y)),
                    width: Math.round(geometry.crop.width),
                    height: Math.round(geometry.crop.height)
                });
            }

            if (geometry.rotation) {
                pipeline = pipeline.rotate(geometry.rotation);
            }

            if (geometry.flipH) pipeline = pipeline.flop(); 
            if (geometry.flipV) pipeline = pipeline.flip(); 

            if (adjustments) {
                if (adjustments.grayscale) pipeline = pipeline.grayscale();
                if (adjustments.blur) pipeline = pipeline.blur(adjustments.blur);
            }

            await pipeline.toFile(newAbsolutePath);

            const newMedia = await this.mediaService.createMedia({
                alt: `Edited ${media.alt || 'image'}`,
                file_path: newRelativePath,
                type: 'image'
            });

            return res.status(HTTP_STATUS_OK).json({ 
                message: "Nouvelle image créée avec succès", 
                media: newMedia 
            });

        } catch (error) {
            console.error("Erreur EditImage:", error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors du traitement de l'image" 
            });
        }
    }
}




