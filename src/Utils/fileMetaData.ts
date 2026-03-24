import { imageSize as sizeOf } from 'image-size';
// @ts-ignore
import ffmpegModule from 'fluent-ffmpeg';
import fs from 'fs';

const ffmpeg = ffmpegModule as any;


interface FileMetadata {
    size: number;
    extension: string;
    mimetype: string;
    width?: number;
    height?: number;
    duration?: number; // Pour les vidéos/audio
    pageCount?: number; // Optionnel : pour les PDF
}

const getExtendedMetadata = async (
    file: Express.Multer.File, 
    type: string
): Promise<FileMetadata> => {
    
    // Initialisation avec les données de base communes à tous les fichiers
    const metadata: FileMetadata = {
        size: file.size,
        mimetype: file.mimetype,
        extension: file.originalname.split('.').pop() || ''
    };

    if (!file.path) return metadata;

    try {
        if (type === 'image') {
            const buffer = fs.readFileSync(file.path);
            const dims = sizeOf(buffer);
            metadata.width = dims.width;
            metadata.height = dims.height;
        } 
        else if (type === 'video') {
            const videoData: any = await new Promise((resolve) => {
                ffmpeg.ffprobe(file.path, (err: any, data: any) => {
                    if (err) {
                        console.error("Erreur ffprobe:", err);
                        return resolve({});
                    }
                    const stream = data.streams.find((s: any) => s.codec_type === 'video');
                    resolve({
                        width: stream?.width,
                        height: stream?.height,
                        duration: data.format.duration
                    });
                });
            });
            
            if (videoData.width) metadata.width = videoData.width;
            if (videoData.height) metadata.height = videoData.height;
            if (videoData.duration) metadata.duration = videoData.duration;
        }
    } catch (e) {
        console.error("Erreur lors de l'extraction des métadonnées:", e);
    }

    return metadata;
};

export {
    getExtendedMetadata,
    type FileMetadata
}