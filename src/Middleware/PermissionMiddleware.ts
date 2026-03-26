import type { NextFunction, Request, Response } from "express";
import PermissionService from "../Services/PermissionService.ts";
import { HTTP_STATUS_FORBIDDEN } from "../Utils/Constantes/ConstantesHttp.ts";

const permissionService = new PermissionService();

export const requirePermission = (permissionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const roleId = req.user?.role?.id;

        if (!roleId) {
            return res.status(HTTP_STATUS_FORBIDDEN).json({
                message: "Accès refusé : rôle introuvable."
            });
        }

        // Utilise PermissionService.getPermissionsByRoleId() — déjà existant
        const permissions = await permissionService.getPermissionsByRoleId(roleId);
        const hasPermission = permissions.some(p => p.name === permissionName);

        if (!hasPermission) {
            return res.status(HTTP_STATUS_FORBIDDEN).json({
                message: `Accès refusé : permission requise.`
            });
        }

        next();
    };
};
