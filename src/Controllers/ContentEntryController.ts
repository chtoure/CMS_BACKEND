import type { Request, Response } from 'express';
import ContentEntryService from '../Services/ContentEntryService.ts';
import ContentTypeService from '../Services/ContentTypeService.ts';
import { 
    HTTP_STATUS_BAD_REQUEST, 
    HTTP_STATUS_CREATED, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_NOT_FOUND, 
    HTTP_STATUS_OK 
} from '../Utils/Constantes/ConstantesHttp.ts';
import type { ContentType } from '../Types/ContentType.ts';
import { RequestHelper } from '../Utils/queryFilter.ts';

const contentEntryService = new ContentEntryService();
const contentTypeService = new ContentTypeService();

export default class ContentEntryController {

    private static async getValidatedContentType(slug: string | undefined, res: Response): Promise<ContentType | null> {
        if (!slug) {
            res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
            return null;
        }
        const contentType = await contentTypeService.getContentTypeBySlug(slug);
        if (!contentType) {
            res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu.` });
            return null;
        }
        return contentType;
    }

    public async getAllEntriesBySlug(req: Request, res: Response) {
        try {
            const ct = await ContentEntryController.getValidatedContentType(req.params.slug, res);
            if (!ct) return;

            const filters = RequestHelper.getFilters(req);
            const data = await contentEntryService.getEntries(ct.id, filters);

            return res.status(HTTP_STATUS_OK).json({
                contentType: ct.name,
                schema: ct.fields_schema,
                ...data
            });
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async getEntryById(req: Request, res: Response) {
        try {
            const entry = await contentEntryService.getContentEntryById(Number(req.params.id));
            if (!entry) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Entrée introuvable." });
            return res.status(HTTP_STATUS_OK).json(entry);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async createEntry(req: Request, res: Response) {
        try {
            const ct = await ContentEntryController.getValidatedContentType(req.params.slug, res);
            if (!ct) return;

            const newEntry = await contentEntryService.createContentEntry({
                ...req.body,
                userId: req.user?.sub,
                contentTypeId: ct.id
            });

            return res.status(HTTP_STATUS_CREATED).json(newEntry);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async updateEntry(req: Request, res: Response) {
        try {
            const result = await contentEntryService.updateContentEntry(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const result = await contentEntryService.updateStatus(Number(req.params.id), status);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async toggleArchive(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { archive } = req.body; 
            const result = await contentEntryService.toggleArchive(Number(id), archive);

            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors du changement d'état d'archivage", 
                details: error.message 
            });
        }
    }

    public async deleteEntry(req: Request, res: Response) {
        try {
            const deleted = await contentEntryService.deleteContentEntry(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(deleted);
        } catch (error: any) {
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: error.message });
        }
    }

    public async getArchivedEntries(req: Request, res: Response) {
        try {
            const baseFilters = RequestHelper.getFilters(req);
            
            const filters = { 
                ...baseFilters, 
                status: 'ARCHIVED' as const 
            };

            const data = await contentEntryService.getEntries(undefined, filters);
            
            return res.status(HTTP_STATUS_OK).json(data);
        } catch (error: any) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des archives",
                details: error.message 
            });
        }
    }
}