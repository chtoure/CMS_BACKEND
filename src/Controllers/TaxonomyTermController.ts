
import type { Request, Response } from "express";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import TaxonomyTermService from "../Services/TaxonomyTermService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";

// Initialisation
const taxonomyTermService = new TaxonomyTermService();

export default class TaxonomyTermController {

    public async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await taxonomyTermService.createTerm(data);
            return res.status(HTTP_STATUS_CREATED).json(result);
        } catch (error) {
            console.error('Erreur lors de la creation d\'un terme', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTermsByTaxonomy(req: Request, res: Response) {
        try {
            const items = await taxonomyTermService.getTermsByTaxonomy(Number(req.params.taxonomyId));
            return res.status(HTTP_STATUS_OK).json(items);
        } catch (error) {
            console.error('Erreur lors de la recuperation des termes', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTermById(req: Request, res: Response) {
        try {
            const item = await taxonomyTermService.getTermById(Number(req.params.id));
            if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Terme non trouvé' });
            return res.status(HTTP_STATUS_OK).json(item);
        } catch (error) {
            console.error('Erreur lors de la recuperation du terme', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTermBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            if (!slug) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
    
            const item = await taxonomyTermService.getTermBySlug(slug);
            if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Terme non trouvé' });
            return res.status(HTTP_STATUS_OK).json(item);
        } catch (error) {
            console.error('Erreur lors de la recuperation du terme', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updateTerm(req: Request, res: Response) {
        try {
            const result = await taxonomyTermService.updateTerm(Number(req.params.id), req.body);
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error) {           
            console.error('Erreur lors de la mise à jour du terme', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deleteTerm(req: Request, res: Response) {
        try {
            const result = await taxonomyTermService.deleteTerm(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error) {
            console.error('Erreur lors de la suppression du terme', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
}



