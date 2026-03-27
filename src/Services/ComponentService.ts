import prisma from "../Utils/PrismaClient.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import type { AnyComponent, ComponentProps } from "../Types/component.ts";



export default class ComponentService {

     static castingComponent(data : any): AnyComponent {
         return {
            ...data,   
            default_props: data.default_props as unknown as ComponentProps,
        } as AnyComponent;
    }



    static castingComponents(items:any[]):AnyComponent[]{
        return items.map(item => ({
            ...item,
            default_props: item.default_props as unknown as ComponentProps,
        })) as AnyComponent[];
    }


    private buildWhereClause(filter?:QueryFilters): Prisma.ComponentWhereInput {
        const where: Prisma.ComponentWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { tag: { contains: query } }
            ];
        }

        return where;
    }

    
    async createComponents(data: AnyComponent[]): Promise<AnyComponent[]> {
        const queries = data.map(comp => {
            return prisma.component.upsert({
                where: { tag: comp.tag },
                update: {
                    ...comp,
                    defaultProps: comp.defaultProps as unknown as Prisma.InputJsonValue,
                },
                create: {
                    ...comp,
                    defaultProps: comp.defaultProps as unknown as Prisma.InputJsonValue,
                }
            });
        });

        const components = await prisma.$transaction(queries);
        return ComponentService.castingComponents(components);
    }


    public async getComponents(filter?:QueryFilters){
        const data = await Paginator.paginate<AnyComponent>(prisma.component, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: ComponentService.castingComponents(data.results)
        };
    }


    public async getComponentById(id: number): Promise<AnyComponent | null> {
        const item = await prisma.component.findUnique({
            where: { id }
        });

        if (!item) return null;
      
       return ComponentService.castingComponent(item);
    }


    public async getComponentByTag(tag: string): Promise<AnyComponent | null> {
        const component = await prisma.component.findUnique({
            where: { tag }
        });

        return ComponentService.castingComponent(component);
    }



    public async updateComponent(id: number, data: AnyComponent): Promise<AnyComponent> {
        const componentUpdated = await prisma.component.update({
            where: { id },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: {
                 ...data,
                 defaultProps: data.defaultProps as unknown as Prisma.InputJsonValue,
            }
        });
      
        return ComponentService.castingComponent(componentUpdated);
    }


    public async deleteComponent(id: number): Promise<AnyComponent> {
        const componentDeleted = await prisma.component.delete({
            where: { id }
        });
       
        return ComponentService.castingComponent(componentDeleted);
    }

}