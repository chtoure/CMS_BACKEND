
import { type Request } from 'express';

interface QueryFilters {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  status?: string | undefined;
  archive?: boolean;
  type?: string | undefined;
}

class RequestHelper {
  static getFilters(req: Request): QueryFilters {
    const filters: QueryFilters = {
      archive: req.query.archive === 'true'
    };

    if (req.query.page) filters.page = Number(req.query.page);
    if (req.query.limit) filters.limit = Number(req.query.limit);
    if (req.query.search) filters.search = req.query.search as string;
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.type) filters.type = req.query.type as string;

    return filters;
  }
}

export {
    RequestHelper,
    type QueryFilters
}