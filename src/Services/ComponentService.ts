import prisma from "../Utils/PrismaClient.ts";
import type { IComponent, IRegisterComponent, IUpdateComponent } from "../Types/Component.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";



export default class ComponentService {

     static castingComponent(data : any): IComponent {
         return {
            ...data,   
            default_props: data.default_props as unknown as IComponent['default_props'],
        } as IComponent;
    }



    static castingComponents(items:any[]):IComponent[]{
        return items.map(item => ({
            ...item,
            default_props: item.default_props as unknown as IComponent['default_props'],
        })) as IComponent[];
    }


    private buildWhereClause(filter?:QueryFilters): Prisma.ComponentWhereInput {
        const where: Prisma.ComponentWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { tag: { contains: query } },
                { description: { contains: query } }
            ];
        }

        return where;
    }

    
    async createComponent(data: IRegisterComponent): Promise<IComponent> {
        const component = await prisma.component.create({
           data:{
            ...data,
            default_props: data.default_props as unknown as Prisma.InputJsonValue
           }
        });

        return ComponentService.castingComponent(component);
    }


    public async getComponents(filter?:QueryFilters){
        const data = await Paginator.paginate<IComponent>(prisma.component, {
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


    public async getComponentById(id: number): Promise<IComponent | null> {
        const item = await prisma.component.findUnique({
            where: { id }
        });

        if (!item) return null;

       
       return ComponentService.castingComponent(item);
    }


    public async getComponentByTag(tag: string): Promise<IComponent | null> {
        const component = await prisma.component.findUnique({
            where: { tag }
        });

        return ComponentService.castingComponent(component);
    }



    public async updateComponent(id: number, data: IUpdateComponent): Promise<IComponent> {
        const componentUpdated = await prisma.component.update({
            where: { id },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: {
                 ...data,
                 default_props: data.default_props as unknown as Prisma.InputJsonValue,
            }
        });

        
        return ComponentService.castingComponent(componentUpdated);
    }


    public async deleteComponent(id: number): Promise<IComponent> {
        const componentDeleted = await prisma.component.delete({
            where: { id }
        });

        
        return ComponentService.castingComponent(componentDeleted);
    }

}