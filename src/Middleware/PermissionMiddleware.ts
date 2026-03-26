import type { NextFunction, Request, Response } from "express";
import PermissionService from "../Services/PermissionService.ts";
import { HTTP_STATUS_FORBIDDEN } from "../Utils/Constantes/ConstantesHttp.ts";

const permissionService = new PermissionService();

export const requirePermission = (permissionName: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const roleId = req.user?.role?.id;

        if (!roleId) {
            return res.status(HTTP_STATUS_FORBIDDEN).json({
                message: "Accès refusé : rôle introuvable."
            });
        }

        const permissionsToCheck = Array.isArray(permissionName) ? permissionName : [permissionName];

        const permissions = await permissionService.getPermissionsByRoleId(roleId);

        const userPermissions = permissions?.map(p => p.name) || [];

        const hasPermission = permissionsToCheck.some(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(HTTP_STATUS_FORBIDDEN).json({
                message: `Accès refusé : permission requise.`
            });
        }

        next();
    };
};
