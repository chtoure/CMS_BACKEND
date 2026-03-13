import type { Request, Response } from "express";
import NavItemService from "../Services/NavItemService.ts";
import type { RegisterNavItem, UpdateNavItem } from "../Types/NavItem.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../Utils/Constantes/ConstantesHttp.ts";

const navItemService = new NavItemService();

export const createNavItem = async (req: Request, res: Response) => {
    try {
        const item: RegisterNavItem = req.body;
        const result = await navItemService.createNavItem(item);
        res.status(HTTP_STATUS_CREATED).json(result);
    } catch (error: any) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const getNavItems = async (req: Request, res: Response) => {
    try {
        const result = await navItemService.getNavItems();
        res.status(HTTP_STATUS_OK).json(result);
    } catch (error: any) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const getNavItemById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });

        const result = await navItemService.getNavItemById(id);
        if (!result) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "NavItem not found" });

        res.status(HTTP_STATUS_OK).json(result);
    } catch (error: any) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const updateNavItem = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });

        const data: UpdateNavItem = req.body;
        const result = await navItemService.updateNavItem(id, data);
        res.status(HTTP_STATUS_OK).json(result);
    } catch (error: any) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const deleteNavItem = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });

        const result = await navItemService.deleteNavItem(id);
        res.status(HTTP_STATUS_OK).json(result);
    } catch (error: any) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
