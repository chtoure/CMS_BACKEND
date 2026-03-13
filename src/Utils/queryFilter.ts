
import { type Request } from 'express';

interface QueryFilters {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  status?: string | undefined;
  archive?: boolean | undefined;
  type?: string[];
}




interface contenusQueryFilters {
    mode?: 'query' | 'single';
    limit?: number | undefined;
    sortBy?: string | undefined;
    order?: 'asc' | 'desc' | undefined;
    taxonomyFilters?: {
      taxonomyId?: number | undefined;
      termIds?: number[] | undefined;
      operator?: 'AND' | 'OR' | undefined;
    } | undefined;
}



class RequestHelper {
  static getFilters(req: Request): QueryFilters {
    const filters: QueryFilters = {};

    if (req.query.type && typeof req.query.type === 'string') {
        filters.type = req.query.type.split(',');
    }

    if (req.query.page) filters.page = Number(req.query.page);
    if (req.query.limit) filters.limit = Number(req.query.limit);
    if (req.query.search) filters.search = req.query.search as string;
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.archive) filters.archive = req.query.archive === 'true' ? true : req.query.archive === 'false' ? false : undefined;

    return filters;
  }


  static getContenusFilters(req: Request): contenusQueryFilters {
    const filters: contenusQueryFilters = {};

    if (req.query.mode) filters.mode = req.query.mode as 'query' | 'single';
    if (req.query.limit) filters.limit = Number(req.query.limit);
    if (req.query.sortBy) filters.sortBy = req.query.sortBy as string;
    if (req.query.order) filters.order = req.query.order as 'asc' | 'desc';
    if (req.query.taxonomyFilters) filters.taxonomyFilters = req.query.taxonomyFilters as any;

    return filters;
  }
}

export {
    RequestHelper,
    type QueryFilters,
    type contenusQueryFilters
}