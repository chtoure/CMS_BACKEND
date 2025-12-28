import type { Request, Response } from "express";
import VariableService from "../Services/VariableService.ts";
import { 
    HTTP_STATUS_OK, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_BAD_REQUEST 
} from "../Utils/Constantes/ConstantesHttp.ts";

export default class VariableController {
    private variableService: VariableService;

    constructor() {
        this.variableService = new VariableService();
    }

    async createVariable(req: Request, res: Response) {
        try {
            const { name, value, collectionId } = req.body;
            if (!name || value === undefined || !collectionId) {
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Données manquantes" });
            }

            const newVariable = await this.variableService.createVariable({ name, value, collectionId });
            return res.status(HTTP_STATUS_OK).json(newVariable);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur création variable", details: error });
        }
    }

    async updateVariable(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = req.body;

            const updated = await this.variableService.updateVariable(id, data);
            return res.status(HTTP_STATUS_OK).json(updated);
        } catch (error) {
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur mise à jour variable", details: error });
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