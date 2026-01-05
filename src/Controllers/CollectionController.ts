import type { Request, Response } from "express";
import CollectionService from "../Services/CollectionService.ts";
import { 
    HTTP_STATUS_OK, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_BAD_REQUEST 
} from "../Utils/Constantes/ConstantesHttp.ts";

export default class CollectionController {
    private collectionService: CollectionService;

    constructor() {
        this.collectionService = new CollectionService();
    }

    // async getAllCollections(req: Request, res: Response) {
    //     try {
    //         const collections = await this.collectionService.getAllCollections();
    //         return res.status(HTTP_STATUS_OK).json(collections);
    //     } catch (error) {
    //         return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
    //             error: "Erreur lors de la récupération des collections", 
    //             details: error 
    //         });
    //     }
    // }


    // CollectionController.ts

    async getAllCollections(req: Request, res: Response) {
        try {
            // Récupération du paramètre de recherche depuis l'URL (ex: /collections?search=primary)
            const searchQuery = req.query.search as string | undefined;

            console.log('ma recherche:', searchQuery);
            

            // On passe la recherche au service
            const collections = await this.collectionService.getAllCollections(searchQuery);

            console.log('ma collection:', collections);
            
            
            return res.status(HTTP_STATUS_OK).json(collections);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la récupération des collections", 
                details: error instanceof Error ? error.message : error 
            });
        }
    }

    async createCollection(req: Request, res: Response) {
        try {
            const { name, type } = req.body;
            if (!name || !type) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Nom et type requis" });
            }

            const newCollection = await this.collectionService.createCollection({ name, type });
            return res.status(HTTP_STATUS_OK).json(newCollection);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur lors de la création de la collection", 
                details: error 
            });
        }
    }

    async deleteCollection(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await this.collectionService.deleteCollection(id);
            return res.status(HTTP_STATUS_OK).json({ message: "Collection supprimée" });
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur suppression", details: error });
        }
    }
}