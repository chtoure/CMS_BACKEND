import {
  BlocTemplateService
} from "./chunk-SERHJ7EL.js";
import {
  Paginator,
  PrismaClient_default
} from "./chunk-A6KLEGV2.js";

// src/Services/SectionService.ts
var SectionService = class _SectionService {
  static castingSection(data) {
    let blocTemplates = data.blocTemplates;
    if (blocTemplates) {
      blocTemplates = BlocTemplateService.castingBlocTemplates(blocTemplates);
    }
    return {
      ...data,
      block_json: data.block_json,
      blocTemplates
    };
  }
  static castingSections(items) {
    return items.map((item) => this.castingSection(item));
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [];
    }
    return where;
  }
  async createSection(data) {
    const section = await PrismaClient_default.section.create({
      data: {
        ...data,
        block_json: data.block_json || {}
      }
    });
    return _SectionService.castingSection(section);
  }
  async getSections(filter) {
    const data = await Paginator.paginate(PrismaClient_default.section, {
      page: filter?.page,
      limit: filter?.limit,
      // where: this.buildWhereClause(filter),
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _SectionService.castingSections(data.results)
    };
  }
  async getSectionById(id) {
    const item = await PrismaClient_default.section.findUnique({
      where: { id },
      include: {
        blocTemplates: {
          include: {
            component: true,
            model: true,
            children: true
          }
        }
      }
    });
    if (!item) return null;
    return _SectionService.castingSection(item);
  }
  async getSectionByRevisionId(revisionId) {
    const sections = await PrismaClient_default.section.findMany({
      where: { pageRevisionId: revisionId },
      include: {
        blocTemplates: {
          where: { parentId: null },
          // Uniquement les blocs racines
          include: {
            component: true,
            model: true,
            children: {
              include: {
                component: true,
                model: true,
                children: true
              }
            }
          }
        }
      }
    });
    if (!sections) return [];
    return _SectionService.castingSections(sections);
  }
  async updateSection(id, data) {
    const sectionUpdated = await PrismaClient_default.section.update({
      where: { id },
      data: {
        ...data,
        block_json: data.block_json
      },
      include: {
        blocTemplates: {
          include: {
            component: true,
            model: true,
            children: true
          }
        }
      }
    });
    return _SectionService.castingSection(sectionUpdated);
  }
  async deleteSection(id) {
    const sectionDeleted = await PrismaClient_default.section.delete({
      where: { id }
    });
    return _SectionService.castingSection(sectionDeleted);
  }
};

export {
  SectionService
};
