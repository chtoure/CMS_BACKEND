import prisma from "../Utils/PrismaClient.ts";
import type { RegisterNavItem, UpdateNavItem } from "../Types/NavItem.ts";
import { Prisma } from "../generated/prisma/client.ts";

export default class NavItemService {
    public async createNavItem(data: RegisterNavItem) {
        return prisma.navItem.create({
            data
        });
    }

    public async getNavItems() {
        // Fetch all nav items, potentially eager-loading children for a recursive menu
        return prisma.navItem.findMany({
            where: {
                parentId: null // Top level items
            },
            include: {
                children: {
                    include: {
                        children: true // Adjust depth as necessary
                    }
                },
                page: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    }

    public async getNavItemById(id: number) {
        return prisma.navItem.findUnique({
            where: { id },
            include: {
                children: true,
                page: true
            }
        });
    }

    public async updateNavItem(id: number, data: UpdateNavItem) {
        return prisma.navItem.update({
            where: { id },
            data
        });
    }

    public async deleteNavItem(id: number) {
        return prisma.navItem.delete({
            where: { id }
        });
    }
}
