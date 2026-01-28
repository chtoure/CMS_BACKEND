
import { type Request } from 'express';

interface QueryFilters {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  status?: string | undefined;
  archive?: boolean | undefined;
  type?: string[];
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
}

export {
    RequestHelper,
    type QueryFilters
}