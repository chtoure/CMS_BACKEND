import {
  Paginator,
  PrismaClient_default
} from "./chunk-A6KLEGV2.js";

// src/Utils/FonctionsUtilitaires.ts
var getFormattedDate = () => {
  const date = /* @__PURE__ */ new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
};

// src/Services/ComponentService.ts
var ComponentService = class _ComponentService {
  static castingComponent(data) {
    return {
      ...data,
      default_props: data.default_props
    };
  }
  static castingComponents(items) {
    return items.map((item) => ({
      ...item,
      default_props: item.default_props
    }));
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { tag: { contains: query } }
      ];
    }
    return where;
  }
  async createComponents(data) {
    const queries = data.map((comp) => {
      return PrismaClient_default.component.upsert({
        where: { tag: comp.tag },
        update: {
          ...comp,
          defaultProps: comp.defaultProps
        },
        create: {
          ...comp,
          defaultProps: comp.defaultProps
        }
      });
    });
    const components = await PrismaClient_default.$transaction(queries);
    return _ComponentService.castingComponents(components);
  }
  async getComponents(filter) {
    const data = await Paginator.paginate(PrismaClient_default.component, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _ComponentService.castingComponents(data.results)
    };
  }
  async getComponentById(id) {
    const item = await PrismaClient_default.component.findUnique({
      where: { id }
    });
    if (!item) return null;
    return _ComponentService.castingComponent(item);
  }
  async getComponentByTag(tag) {
    const component = await PrismaClient_default.component.findUnique({
      where: { tag }
    });
    return _ComponentService.castingComponent(component);
  }
  async updateComponent(id, data) {
    const componentUpdated = await PrismaClient_default.component.update({
      where: { id },
      // On cast pour éviter les erreurs de compatibilité JSON
      data: {
        ...data,
        defaultProps: data.defaultProps
      }
    });
    return _ComponentService.castingComponent(componentUpdated);
  }
  async deleteComponent(id) {
    const componentDeleted = await PrismaClient_default.component.delete({
      where: { id }
    });
    return _ComponentService.castingComponent(componentDeleted);
  }
};

// src/Services/BlocTemplateService.ts
import merge from "lodash/merge.js";

// src/Services/MediaService.ts
var MediaService = class {
  buildWhereClause(filters) {
    const where = {};
    if (filters?.type && filters.type.length > 0) where.type = { in: filters.type };
    if (filters?.search?.trim()) {
      const query = filters.search.trim();
      where.OR = [
        { file_path: { contains: query } },
        { alt: { contains: query } },
        { type: { contains: query } }
      ];
    }
    return where;
  }
  async createMedia(media) {
    return PrismaClient_default.media.create({
      data: media
    });
  }
  async updateMedia(id, media) {
    return PrismaClient_default.media.update({
      where: { id },
      data: media
    });
  }
  async deleteMedia(id) {
    return PrismaClient_default.media.delete({
      where: { id }
    });
  }
  async deleteMedias(ids) {
    const result = await PrismaClient_default.media.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    return result.count;
  }
  async getMediaById(id) {
    return PrismaClient_default.media.findUnique({
      where: { id }
    });
  }
  async getMediaByIds(ids) {
    return PrismaClient_default.media.findMany({
      where: {
        id: { in: ids }
      }
    });
  }
  async getAllMedia(filters) {
    return Paginator.paginate(PrismaClient_default.media, {
      page: filters?.page,
      limit: filters?.limit,
      where: this.buildWhereClause(filters),
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  async countMedia(type) {
    return PrismaClient_default.media.count({
      where: type ? { type } : {}
    });
  }
};

// src/Services/ContentEntryService.ts
var ContentEntryService = class {
  buildWhereClause(contentTypeId, filters) {
    const where = {};
    if (contentTypeId) where.contentTypeId = contentTypeId;
    if (filters?.status) {
      where.status = filters.status;
    } else {
      where.status = { not: "ARCHIVED" };
    }
    if (filters?.search?.trim()) {
      const query = filters.search.trim();
      where.OR = [
        { data_json: { path: "$.title", string_contains: query } },
        { data_json: { path: "$.name", string_contains: query } },
        { data_json: { path: "$.content", string_contains: query } },
        {
          user: {
            full_name: {
              contains: query
            }
          }
        }
      ];
    }
    return where;
  }
  async getEntries(contentTypeId, filters) {
    return Paginator.paginate(PrismaClient_default.contentEntry, {
      page: filters?.page,
      limit: filters?.limit,
      where: this.buildWhereClause(contentTypeId, filters),
      include: { user: true, contentType: true },
      orderBy: { createdAt: "desc" }
    });
  }
  async syncRelations(tx, entryId, contentTypeId, dataJson) {
    const ct = await tx.contentType.findUnique({
      where: { id: contentTypeId },
      select: { fields_schema: true }
    });
    if (!ct?.fields_schema) return;
    const fields = typeof ct.fields_schema === "string" ? JSON.parse(ct.fields_schema) : ct.fields_schema;
    const relationFields = fields.filter((f) => f.type === "relation" || f.type === "media" || f.type === "taxonomy");
    const relationsToCreate = [];
    relationFields.forEach((field) => {
      const val = dataJson[field.name];
      if (val === void 0 || val === null) return;
      const ids = Array.isArray(val) ? val : [val];
      ids.forEach((id) => {
        const numericId = Number(id);
        if (!isNaN(numericId)) {
          relationsToCreate.push({
            sourceId: entryId,
            fieldName: field.name,
            targetEntryId: field.type === "relation" ? numericId : null,
            targetMediaId: field.type === "media" ? numericId : null,
            targetTaxonomyId: field.type === "taxonomy" ? numericId : null
          });
        }
      });
    });
    await tx.contentEntryRelation.deleteMany({ where: { sourceId: entryId } });
    if (relationsToCreate.length > 0) {
      await tx.contentEntryRelation.createMany({ data: relationsToCreate });
    }
  }
  async syncTaxonomyTerm(tx, entryId, contentTypeId, dataJson) {
    const ct = await tx.contentType.findUnique({
      where: { id: contentTypeId },
      select: { fields_schema: true }
    });
    if (!ct?.fields_schema) return;
    const fields = typeof ct.fields_schema === "string" ? JSON.parse(ct.fields_schema) : ct.fields_schema;
    const taxonomyFields = fields.filter((f) => f.type === "taxonomy");
    const termIdsToConnect = [];
    for (const field of taxonomyFields) {
      const val = dataJson[field.name];
      if (val === void 0 || val === null) continue;
      const ids = Array.isArray(val) ? val.map(Number) : [Number(val)];
      const validIds = ids.filter((id) => !isNaN(id));
      if (validIds.length === 0) continue;
      const validTerms = await tx.taxonomyTerm.findMany({
        where: {
          id: { in: validIds },
          taxonomy: { id: { in: field.taxonomyIds } }
        },
        select: { id: true }
      });
      termIdsToConnect.push(...validTerms.map((t) => t.id));
    }
    await tx.contentEntry.update({
      where: { id: entryId },
      data: {
        taxonomyTerms: {
          set: termIdsToConnect.map((id) => ({ id }))
        }
      }
    });
  }
  async createContentEntry(data) {
    return PrismaClient_default.$transaction(async (tx) => {
      const entry = await tx.contentEntry.create({
        data
      });
      await this.syncRelations(tx, entry.id, data.contentTypeId, data.data_json);
      await this.syncTaxonomyTerm(tx, entry.id, data.contentTypeId, data.data_json);
      return entry;
    });
  }
  async updateContentEntry(id, data) {
    return PrismaClient_default.$transaction(async (tx) => {
      const entry = await tx.contentEntry.update({
        where: { id },
        data
      });
      if (data.data_json && entry.contentTypeId) {
        await this.syncRelations(tx, id, entry.contentTypeId, data.data_json);
        await this.syncTaxonomyTerm(tx, id, entry.contentTypeId, data.data_json);
      }
      return entry;
    });
  }
  async deleteContentEntry(id) {
    const usages = await PrismaClient_default.contentEntryRelation.findMany({
      where: { targetEntryId: id },
      include: { source: { select: { id: true, data_json: true } } }
    });
    if (usages.length > 0) {
      const names = usages.map((u) => u.source.data_json?.title || `ID: ${u.source.id}`);
      throw new Error(`Suppression impossible : ce contenu est li\xE9 \xE0 "${names.join(", ")}"`);
    }
    return PrismaClient_default.contentEntry.delete({ where: { id } });
  }
  async getContentEntryById(id) {
    const entry = await PrismaClient_default.contentEntry.findUnique({
      where: { id },
      include: {
        contentType: true,
        user: true,
        outgoingRelations: {
          include: {
            targetEntry: true,
            targetMedia: true
          }
        }
      }
    });
    return entry;
  }
  async updateStatus(id, status) {
    return PrismaClient_default.contentEntry.update({
      where: { id },
      data: {
        status,
        ...status === "ARCHIVED" ? { archivedAt: /* @__PURE__ */ new Date() } : { archivedAt: null }
      }
    });
  }
  async toggleArchive(id) {
    const currentEntry = await PrismaClient_default.contentEntry.findUnique({
      where: { id },
      select: { id: true, status: true }
    });
    if (!currentEntry) throw new Error("Contenu introuvable.");
    const isCurrentlyArchived = currentEntry.status === "ARCHIVED";
    if (!isCurrentlyArchived) {
      const activeUsages = await PrismaClient_default.contentEntryRelation.findMany({
        where: {
          targetEntryId: id,
          source: {
            status: { in: ["PUBLISHED", "DRAFT"] }
          }
        },
        include: {
          source: { select: { id: true, data_json: true, status: true } }
        }
      });
      if (activeUsages.length > 0) {
        const names = activeUsages.map((u) => u.source.data_json?.title || `ID: ${u.source.id}`);
        throw new Error(`Archivage bloqu\xE9 : Ce contenu est utilis\xE9 par des \xE9l\xE9ments actifs : "${names.join(", ")}".`);
      }
      return this.updateStatus(id, "ARCHIVED");
    } else {
      const archivedDependencies = await PrismaClient_default.contentEntryRelation.findMany({
        where: {
          sourceId: id,
          targetEntry: { status: "ARCHIVED" }
        },
        include: {
          targetEntry: { select: { id: true, data_json: true } }
        }
      });
      if (archivedDependencies.length > 0) {
        const names = archivedDependencies.map((d) => d.targetEntry?.data_json?.title || `ID: ${d.targetEntryId}`);
        throw new Error(`D\xE9sarchivage impossible : Ce contenu d\xE9pend de l'\xE9l\xE9ment archiv\xE9 "${names.join(", ")}".`);
      }
      return this.updateStatus(id, "DRAFT");
    }
  }
  async getEntriesByContentTypeIdControl(contentTypeId, filters) {
    const queryOptions = {
      where: {
        contentTypeId
      },
      orderBy: {
        [filters?.sortBy || "createdAt"]: filters?.order || "desc"
      },
      select: {
        data_json: true
      }
    };
    if (filters?.limit) {
      queryOptions.take = Number(filters.limit);
    }
    return PrismaClient_default.contentEntry.findMany(queryOptions);
  }
};

// src/Utils/StyleInheritance.ts
import mergeWith from "lodash/mergeWith.js";
var StyleInheritance = class {
  /**
   * Personnalisation du merge pour lodash.
   * Les VariableProperty et les tableaux sont remplacés entièrement, pas fusionnés en profondeur.
   */
  static customMerge(objValue, srcValue) {
    if (Array.isArray(srcValue)) {
      return srcValue;
    }
    if (srcValue !== null && typeof srcValue === "object" && "type" in srcValue) {
      const t = srcValue.type;
      if (t === "static" || t === "variable" || t === "media") {
        return srcValue;
      }
    }
    return void 0;
  }
  /**
   * Fusionne les styles (props) du modèle avec ceux de l'instance.
   * L'instance a priorité sur le modèle.
   * Utilise le customMerge pour traiter correctement les VariableProperty et les tableaux.
   */
  static merge(modelProps, instanceProps) {
    return mergeWith({}, modelProps ?? {}, instanceProps ?? {}, this.customMerge);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // DATA INHERITANCE
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Personnalisation du merge pour les données (data).
   * Les VariableProperty ({ type: 'static'|'variable'|'media' }) et les tableaux
   * sont remplacés entièrement depuis l'instance, jamais fusionnés en profondeur.
   */
  static customDataMerge(objValue, srcValue) {
    if (Array.isArray(srcValue)) return srcValue;
    if (srcValue !== null && typeof srcValue === "object" && "type" in srcValue && (srcValue.type === "static" || srcValue.type === "variable" || srcValue.type === "media")) {
      return srcValue;
    }
    return void 0;
  }
  /**
   * Fusionne le data du modèle avec le data de l'instance.
   * L'instance a priorité sur le modèle.
   */
  static mergeData(modelData, instanceData) {
    return mergeWith({}, modelData ?? {}, instanceData ?? {}, this.customDataMerge);
  }
  /**
   * Applique l'héritage de manière récursive sur un arbre de blocs.
   * Fusionne à la fois les `styles` (props) et le `data` du modèle vers l'instance.
   */
  static applyInheritance(bloc) {
    if (!bloc) return bloc;
    let effectiveProps = bloc.props || {};
    if (bloc.model?.props) {
      const modelProps = bloc.model.props;
      effectiveProps = this.merge(modelProps, effectiveProps);
      const mergedData = this.mergeData(
        modelProps.data ?? {},
        effectiveProps.data ?? {}
      );
      effectiveProps = { ...effectiveProps, data: mergedData };
    }
    const children = bloc.children?.map((child) => this.applyInheritance(child));
    return {
      ...bloc,
      props: effectiveProps,
      children
    };
  }
  /**
   * Calcule les propriétés (styles) effectives totales d'un bloc (Modèle + Instance).
   */
  static computeEffectiveProps(bloc) {
    if (!bloc) return {};
    const baseProps = bloc.model?.props ? this.computeEffectiveProps(bloc.model) : {};
    return this.merge(baseProps, bloc.props);
  }
  /**
   * Calcule le data effectif total d'un bloc (Modèle + Instance).
   */
  static computeEffectiveData(bloc) {
    if (!bloc) return {};
    const baseData = bloc.model?.props?.data ? this.computeEffectiveData(bloc.model) : {};
    return this.mergeData(baseData, bloc.props?.data ?? {});
  }
  /**
   * Vérifie si un objet est une propriété atomique (VariableProperty ou MediaProperty).
   * Ces objets doivent être remplacés entièrement, jamais fusionnés en profondeur.
   */
  static isAtomicProperty(obj) {
    if (obj === null || typeof obj !== "object") return false;
    if (!("type" in obj)) return false;
    return obj.type === "static" || obj.type === "variable" || obj.type === "media";
  }
  /**
   * Calcule uniquement les propriétés (styles) qui diffèrent entre le modèle et les propriétés soumises.
   * C'est une opération de "diff" profond utilisée pour ne stocker que les surcharges en base.
   */
  static computeOverrides(modelProps, submittedProps) {
    if (!modelProps) return submittedProps;
    const diff = {};
    const allKeys = /* @__PURE__ */ new Set([...Object.keys(modelProps || {}), ...Object.keys(submittedProps || {})]);
    allKeys.forEach((key) => {
      const modelVal = modelProps[key];
      const submittedVal = submittedProps[key];
      if (submittedVal === void 0 && modelVal !== void 0) {
        diff[key] = null;
      } else if (this.isAtomicProperty(submittedVal) || Array.isArray(submittedVal)) {
        if (JSON.stringify(modelVal) !== JSON.stringify(submittedVal)) {
          diff[key] = submittedVal;
        }
      } else if (typeof submittedVal === "object" && submittedVal !== null && typeof modelVal === "object" && modelVal !== null) {
        const nestedDiff = this.computeOverrides(modelVal, submittedVal);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (JSON.stringify(modelVal) !== JSON.stringify(submittedVal)) {
        diff[key] = submittedVal;
      }
    });
    return diff;
  }
  /**
   * Calcule uniquement les champs data qui diffèrent entre le modèle et le data soumis.
   * Utilisé pour ne stocker que les surcharges de data en base (même logique que computeOverrides).
   */
  static computeDataOverrides(modelData, submittedData) {
    return this.computeOverrides(modelData ?? {}, submittedData ?? {});
  }
};

// src/Services/BlocTemplateService.ts
var componentService = new ComponentService();
var mediaService = new MediaService();
var contentEntryService = new ContentEntryService();
var BlocTemplateService = class _BlocTemplateService {
  static castingBlocTemplate(data) {
    return StyleInheritance.applyInheritance(data);
  }
  // static castingBlocTemplates(items:any[]):BlocTemplate[]{
  //     return items.map(item => {
  //         return this.castingBlocTemplate(item);
  //     }) as BlocTemplate[];
  // }
  // Fusionne les props par defaut du composant avec les props par defaut du bloc template
  static mergeDefaultJson(blocTemplate) {
    const mergedProps = merge(
      {},
      blocTemplate.component?.defaultProps,
      blocTemplate.model?.props,
      blocTemplate.props
    );
    return mergedProps;
  }
  static castingBlocTemplates(items) {
    return items.map((item) => _BlocTemplateService.castingBlocTemplate(item));
  }
  /**
   * Parcourt récursivement un objet de props pour collecter tous les mediaId distincts.
   */
  static collectMediaIds(obj, ids = /* @__PURE__ */ new Set()) {
    if (!obj || typeof obj !== "object") return ids;
    if (obj.type === "media" && typeof obj.mediaId === "number") {
      ids.add(obj.mediaId);
      return ids;
    }
    for (const val of Object.values(obj)) {
      _BlocTemplateService.collectMediaIds(val, ids);
    }
    return ids;
  }
  /**
   * Injecte les `url` dans toutes les MediaProperty d'un objet de props.
   * Ne modifie que les clés { type: 'media' }, laisse tout le reste intact.
   */
  static injectMediaUrls(obj, urlMap) {
    if (!obj || typeof obj !== "object") return obj;
    if (obj.type === "media" && typeof obj.mediaId === "number") {
      return { ...obj, url: urlMap.get(obj.mediaId) ?? null };
    }
    if (Array.isArray(obj)) return obj.map((v) => _BlocTemplateService.injectMediaUrls(v, urlMap));
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = _BlocTemplateService.injectMediaUrls(v, urlMap);
    }
    return result;
  }
  /**
   * Résout tous les mediaId présents dans une liste de BlocTemplates (en une seule requête SQL).
   * Retourne les BlocTemplates avec les urls Media injectées dans leurs props.
   */
  static async resolveMediaProps(blocs) {
    const ids = /* @__PURE__ */ new Set();
    for (const bloc of blocs) {
      _BlocTemplateService.collectMediaIds(bloc.props, ids);
    }
    if (ids.size === 0) return blocs;
    const medias = await mediaService.getMediaByIds([...ids]);
    const urlMap = new Map(medias.map((m) => [m.id, m.file_path]));
    return blocs.map((bloc) => ({
      ...bloc,
      props: _BlocTemplateService.injectMediaUrls(bloc.props, urlMap),
      children: bloc.children ? _BlocTemplateService.resolveMediaProps(bloc.children) : void 0
    }));
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } }
      ];
    }
    return where;
  }
  // private async generateNameBlocTemplate(componentId: number): Promise<string> {
  //     const component = await componentService.getComponentById(componentId);
  //     if (!component) throw new Error(`Composant avec ID ${componentId} non trouvé`);
  //     return `${component.name}-${getFormattedDate()}`;
  // }
  async generateNameBlocTemplate(componentId) {
    const component = await componentService.getComponentById(componentId);
    if (!component) throw new Error(`Composant avec ID ${componentId} non trouv\xE9`);
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${component.name}-${getFormattedDate()}-${randomSuffix}`;
  }
  async createBlocTemplate(data) {
    const nameBlocTemplate = await this.generateNameBlocTemplate(data.componentId);
    const component = await componentService.getComponentById(data.componentId);
    if (!component) throw new Error(`Composant avec ID ${data.componentId} non trouv\xE9`);
    const blocTemplate = await PrismaClient_default.blocTemplate.create({
      data: {
        ...data,
        name: nameBlocTemplate,
        props: component.defaultProps
      },
      include: {
        component: true,
        model: true
      }
    });
    return _BlocTemplateService.castingBlocTemplate(blocTemplate);
  }
  async getBlocTemplates(filter) {
    const data = await Paginator.paginate(PrismaClient_default.blocTemplate, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      include: {
        component: true,
        model: true
      },
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _BlocTemplateService.castingBlocTemplates(data.results)
    };
  }
  async getTreeSection(sectionId) {
    const allNodes = await PrismaClient_default.blocTemplate.findMany({
      where: { sectionId },
      include: {
        component: true,
        model: true
      },
      orderBy: { order: "asc" }
    });
    const nodeMap = /* @__PURE__ */ new Map();
    const roots = [];
    for (const node of allNodes) {
      node.children = [];
      nodeMap.set(node.id, node);
    }
    for (const node of allNodes) {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }
    for (const node of allNodes) {
      node.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const casted = _BlocTemplateService.castingBlocTemplates(roots);
    return _BlocTemplateService.resolveMediaProps(casted);
  }
  async getBlocTemplatesCustom() {
    const allNodes = await PrismaClient_default.blocTemplate.findMany({
      where: { is_custom: true },
      include: {
        component: true,
        model: true
      },
      orderBy: { createdAt: "asc" }
    });
    const nodeMap = /* @__PURE__ */ new Map();
    const roots = [];
    for (const node of allNodes) {
      node.children = [];
      nodeMap.set(node.id, node);
    }
    for (const node of allNodes) {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }
    for (const node of allNodes) {
      node.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const casted = _BlocTemplateService.castingBlocTemplates(roots);
    return _BlocTemplateService.resolveMediaProps(casted);
  }
  async getBlocTemplateById(id) {
    const item = await PrismaClient_default.blocTemplate.findUnique({
      where: { id },
      include: {
        component: true,
        model: true
      }
    });
    if (!item) return null;
    const casted = _BlocTemplateService.castingBlocTemplate(item);
    const resolved = await _BlocTemplateService.resolveMediaProps([casted]);
    return resolved[0] ?? null;
  }
  async updateBlocTemplate(id, data) {
    const { sectionId, parentId, componentId, modelId, props, ...rest } = data;
    const updateData = {
      ...rest
    };
    if (modelId === null) {
      updateData.model = { disconnect: true };
    } else if (modelId !== void 0) {
      updateData.model = { connect: { id: modelId } };
    }
    if (rest.is_custom === true) {
      updateData.section = { disconnect: true };
    } else if (sectionId === null) {
      updateData.section = { disconnect: true };
    } else if (sectionId !== void 0) {
      updateData.section = { connect: { id: sectionId } };
    }
    if (parentId === null) {
      updateData.parent = { disconnect: true };
    } else if (parentId !== void 0) {
      updateData.parent = { connect: { id: parentId } };
    }
    if (componentId) {
      updateData.component = { connect: { id: componentId } };
    }
    if (props !== void 0 || data.is_custom !== void 0) {
      const current = await PrismaClient_default.blocTemplate.findUnique({
        where: { id },
        include: {
          model: {
            include: { model: true }
            // Supporte au moins 2 niveaux d'héritage pour le merge d'update
          }
        }
      });
      if (current) {
        const isNowCustom = current.is_custom;
        const currentFullStyle = StyleInheritance.computeEffectiveProps(current);
        const newFullStyle = props ? props : currentFullStyle;
        if (isNowCustom) {
          updateData.props = newFullStyle;
          updateData.model = { disconnect: true };
        } else if (current.modelId) {
          const modelProps = current.model?.props || {};
          const diffProps = StyleInheritance.computeOverrides(modelProps, newFullStyle);
          updateData.props = diffProps;
        } else if (props !== void 0) {
          updateData.props = props;
        }
      }
    }
    const updated = await PrismaClient_default.blocTemplate.update({
      where: { id },
      include: {
        component: true,
        model: true
      },
      data: updateData
    });
    return _BlocTemplateService.castingBlocTemplate(updated);
  }
  async deleteBlocTemplate(id) {
    const blocTemplateDeleted = await PrismaClient_default.blocTemplate.delete({
      where: { id },
      include: { component: true }
    });
    return _BlocTemplateService.castingBlocTemplate(blocTemplateDeleted);
  }
  async hydrateParams(params, currentData, context) {
    const data = { ...currentData };
    for (const param of params) {
      const type = param.type;
      switch (type.source) {
        // Cas : Source PARENT
        case "parent" /* PARENT */:
          if (context && type.parentKey) {
            let val = context[type.parentKey];
            if (type.targetType === "image" /* IMAGE */ && typeof val === "number") {
              const media = await mediaService.getMediaById(val);
              data[param.name] = media ? `${process.env.APP_URL || ""}${media.file_path}` : null;
            } else {
              data[param.name] = val;
            }
          }
          break;
        // Cas : Source IMAGE
        case "image" /* IMAGE */:
          data[param.name] = type.src;
          break;
        // Cas : Source STATIC
        case "static" /* STATIC */:
          data[param.name] = type.value;
          break;
      }
    }
    return data;
  }
  async resolveCMSData(block) {
    const contenuParam = block.props.params?.find((p) => p.type.source === "contenus" /* CONTENUS */);
    if (!contenuParam) return null;
    const config = contenuParam.type.config;
    if (config.mode === "single") {
      const entry = await contentEntryService.getContentEntryById(config.entryId);
      return entry ? { id: entry.id, ...entry.data_json || {} } : null;
    }
    if (config.mode === "query") {
      const items = await contentEntryService.getEntriesByContentTypeIdControl(contenuParam.type.contentTypeId, config);
      const ct = await PrismaClient_default.contentType.findUnique({
        where: { id: contenuParam.type.contentTypeId },
        select: { fields_schema: true }
      });
      const fields = ct?.fields_schema ? typeof ct.fields_schema === "string" ? JSON.parse(ct.fields_schema) : ct.fields_schema : [];
      const mediaFields = fields.filter((f) => f.type === "media" || f.type === "FieldType.MEDIA");
      const mediaIds = /* @__PURE__ */ new Set();
      items.forEach((item) => {
        const data = item.data_json || {};
        mediaFields.forEach((f) => {
          const val = data[f.name];
          if (typeof val === "number") mediaIds.add(val);
        });
      });
      const medias = await mediaService.getMediaByIds(Array.from(mediaIds));
      return {
        items: items.map((item) => {
          const resolvedData = { ...item.data_json || {} };
          mediaFields.forEach((f) => {
            const val = resolvedData[f.name];
            if (typeof val === "number") {
              const media = medias.find((m) => m.id === val);
              if (media) resolvedData[f.name] = `${process.env.APP_URL || ""}${media.file_path}`;
            }
          });
          return {
            id: item.id,
            ...resolvedData
          };
        }),
        is_collection: true
      };
    }
    return null;
  }
  async buildRecursiveTree(blocks, parentId = null, parentContext = null) {
    const currentLevelBlocks = blocks.filter((block) => block.parentId === parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const hydratedBlocks = [];
    for (const block of currentLevelBlocks) {
      const baseProps = _BlocTemplateService.mergeDefaultJson(block);
      const blockInjectedData = await this.resolveCMSData(block);
      const resolvedData = await this.hydrateParams(
        baseProps.params || [],
        baseProps.data || {},
        parentContext || blockInjectedData
      );
      hydratedBlocks.push({
        id: block.id,
        blocTemplateId: block.id,
        name: block.name,
        order: block.order,
        tag: block.component?.tag || "",
        family: block.component?.family || "",
        styles: baseProps.styles,
        // On garde les styles tels quels
        params: baseProps.params || [],
        data: {
          ...resolvedData,
          // On injecte les items si c'est une requête de collection
          ...blockInjectedData?.items ? { items: blockInjectedData.items, is_collection: true } : {}
        },
        componentDefinitionId: block.componentId,
        // Récursivité : on descend en passant le contexte actuel aux enfants
        children: await this.buildRecursiveTree(blocks, block.id, blockInjectedData)
      });
    }
    return hydratedBlocks;
  }
};

export {
  MediaService,
  ContentEntryService,
  ComponentService,
  BlocTemplateService
};
