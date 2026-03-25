import type { Request, Response } from "express";
import VariableService from "../Services/VariableService.ts";
import { 
    HTTP_STATUS_OK, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_BAD_REQUEST 
} from "../Utils/Constantes/ConstantesHttp.ts";
import CollectionService from "../Services/CollectionService.ts";
import { validateValueByType } from "../Utils/validateType.ts";

export default class VariableController {
    private variableService: VariableService;
    private collectionService: CollectionService;

    constructor() {
        this.variableService = new VariableService();
        this.collectionService = new CollectionService();
    }

    async getAllVariables(req: Request, res: Response) {
        try {
            const variables = await this.variableService.getAllVariables();
            return res.status(HTTP_STATUS_OK).json(variables);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur récupération variables", details: error });
        }
    }

    async getVariableById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const variable = await this.variableService.getVariableById(id);
            return res.status(HTTP_STATUS_OK).json(variable);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur récupération variable", details: error });
        }
    }

    async createVariable(req: Request, res: Response) {
        try {
            const { name, value, collectionId } = req.body;

            if (!name || value === undefined || !collectionId) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Données manquantes" });
            }

            const collection = await this.collectionService.getCollectionById(collectionId);
            if (!collection) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Collection introuvable" });
            }

            if (!validateValueByType(collection.type, value)) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ 
                    error: `La valeur fournie n'est pas valide pour le type ${collection.type}` 
                });
            }

            const newVariable = await this.variableService.createVariable({ name, value, collectionId });
            return res.status(HTTP_STATUS_OK).json(newVariable);
        } catch (error) {
            console.log(error);
            
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur création variable", details: error });
        }
    }


    async updateVariable(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            let { name, value } = req.body;

            const variable = await this.variableService.getVariableById(id);

            if (name==undefined) {
                name=variable?.name;
            }

            if (value==undefined) {
                value=variable?.value;
            }

            console.log('nanan', name, value);

            const collection = await this.collectionService.getCollectionById(variable?.collectionId || 0);

            if (!variable || !collection) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Variable introuvable" });
            }

            if (!validateValueByType(collection.type, value)) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ 
                    error: `Type invalide. Attendu: ${collection.type}` 
                });
            }

            const updated = await this.variableService.updateVariable(id, { name, value });
            return res.status(HTTP_STATUS_OK).json(updated);
        } catch (error) {
            console.log(error);
            
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur mise à jour", details: error });
        }
    }

    async deleteVariables(req: Request, res: Response) {
        try {
            const id = Number(req.params?.id);
            let ids = req.body?.ids as number[] | undefined;

            if (!isNaN(id)) {
                ids = [id];
            } else if (!Array.isArray(ids)) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "ID(s) invalide(s)" });
            }

            const count = await this.variableService.deleteVariables(ids);
            return res.status(HTTP_STATUS_OK).json({ message: `${count} variable(s) supprimée(s)` });
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur suppression", details: error });
        }
    }
}