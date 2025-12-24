import fs from 'fs';
import path from 'path';

function deleteFile(file_path: string): void {
    try {
        const cleanPath = file_path.startsWith('/') ? file_path.substring(1) : file_path;
        
        const absolutePath = path.join(process.cwd(), cleanPath);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log(`Fichier supprimé : ${absolutePath}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression physique : ${error}`);
    }
}

export { deleteFile };   