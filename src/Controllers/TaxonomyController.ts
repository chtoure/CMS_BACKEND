
import type { Request, Response } from "express";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";
import TaxonomyService from "../Services/TaxonomyService.ts";
import TaxonomyTermService from "../Services/TaxonomyTermService.ts";
import { getErrorStatus, handlePrismaError } from "../Utils/ErrorPrisma.ts";

// Initialisation
const taxonomyService = new TaxonomyService();
const taxonomyTermService = new TaxonomyTermService();

export default class TaxonomyController {

    public async create(req: Request, res: Response) {
        const { name,slug,description,terms } = req.body;
        try {
            const data = { name,slug,description };
            const result = await taxonomyService.createTaxonomy(data);
            if (terms.length > 0) {
                const termsData = terms.map((term:string) => ({
                    name: term,
                    slug: term.toLowerCase().replace(/\s+/g, '-'),
                    taxonomyId: result.id
                }));
                await taxonomyTermService.createTerms(termsData);
            }
            return res.status(HTTP_STATUS_CREATED).json(result);
        } catch (error: any) {
            console.log(error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTaxonomies(req: Request, res: Response) {
        try {
            // Calculs de base pour la pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const filter = req.query.archive === 'true' ? true : req.query.archive === 'false' ? false : null;

            // Appel simultané pour les données et le total
            const [taxonomyList, totalCount] = await Promise.all([
                taxonomyService.getAllTaxonomies(filter, skip, limit),
                taxonomyService.countTaxonomies(filter)
            ]);

            const totalPages = Math.ceil(totalCount / limit);
            const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            // Construction des liens de navigation
            const next = page < totalPages 
                ? `${fullUrl}?page=${page + 1}&limit=${limit}${filter !== null ? `&archive=${filter}` : ''}` 
                : null;
            const previous = page > 1 
                ? `${fullUrl}?page=${page - 1}&limit=${limit}${filter !== null ? `&archive=${filter}` : ''}` 
                : null;
            
            // Réponse structurée
            return res.status(HTTP_STATUS_OK).json({
                count: totalCount,
                next: next,
                previous: previous,
                total_pages: totalPages,
                current_page: page,
                results: taxonomyList
            });

        } catch (error) {
            console.error('Erreur lors de la recuperation des taxonomies', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTaxonomiesNoPaginate(req: Request, res: Response) {
        try {
            const items = await taxonomyService.getAllTaxonomiesNoPaginate();
            return res.status(HTTP_STATUS_OK).json(items);
        } catch (error) {
            console.error('Erreur lors de la recuperation des taxonomies', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTaxonomyById(req: Request, res: Response) {
        try {
            const item = await taxonomyService.getTaxonomyById(Number(req.params.id));
            if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Taxonomie non trouvée ou archivée' });
            return res.status(HTTP_STATUS_OK).json(item);
        } catch (error) {
            console.error('Erreur lors de la recuperation de la taxonomie', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async getTaxonomyBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            if (!slug) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le paramètre slug est manquant." });
    
            const item = await taxonomyService.getTaxonomyBySlug(slug);
            if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Taxonomie non trouvée ou archivée' });
            return res.status(HTTP_STATUS_OK).json(item);
        } catch (error) {
            console.error('Erreur lors de la recuperation de la taxonomie', error);
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async updateTaxonomy(req: Request, res: Response) {
        const { name,slug,description,terms } = req.body;   
        try {
            const result = await taxonomyService.updateTaxonomy(Number(req.params.id), { name,slug,description });
            if (terms.length > 0) {
                const termsData = terms.map((term:string) => ({
                    name: term,
                    slug: term.toLowerCase().replace(/\s+/g, '-')
                }));
                console.log(termsData);
                await taxonomyTermService.updateTerms(result.id,termsData);
                return res.status(HTTP_STATUS_OK).json(result);
            }
            // Si pas de termes, on met à jour la taxonomie sans les termes
            await taxonomyTermService.deleteTerms(result.id);
            return res.status(HTTP_STATUS_OK).json(result);
           
        } catch (error: any) {  
            console.error('Erreur lors de la mise à jour de la taxonomie', error);         
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async archivedTaxonomy(req: Request, res: Response) {
        try {
            const result = await taxonomyService.archivedTaxonomy(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error) {
            console.error('Erreur lors de l\'archivage de la taxonomie', error);         
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async restoreTaxonomy(req: Request, res: Response) {
        try {            
            const result = await taxonomyService.restoredTaxonomy(Number(req.params.id));
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error) {
            console.error('Erreur lors de la restauration de la taxonomie', error);         
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }

    public async deleteTaxonomyArchived(req: Request, res: Response) {
        try {
            const result = await taxonomyService.deleteTaxonomy(Number(req.params.id));
            if (!result) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Taxonomie non trouvée ou non archivée' });
            return res.status(HTTP_STATUS_OK).json(result);
        } catch (error) {
            console.error('Erreur lors de la suppression de la taxonomie', error);         
            const errorMessage = handlePrismaError(error);
            return res.status(getErrorStatus(error)).json({ message: errorMessage });
        }
    }
}
