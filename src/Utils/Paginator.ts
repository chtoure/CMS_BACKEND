import type { PaginatedResponse } from "../Types/Pagination.ts";

export class Paginator {
  static async paginate<T>(
    model: any,
    options: {
      page: number;
      limit: number;
      where?: object;
      orderBy?: object;
      baseUrl: string;
      include?: object;
    }
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, where = {}, orderBy = { createdAt: 'desc' }, baseUrl, include } = options;
    
    const skip = (page - 1) * limit;

    const [results, count] = await Promise.all([
      model.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include
      }),
      model.count({ where }),
    ]);

    const totalPages = Math.ceil(count / limit);

    // Construction des URLs comme dans Django
    const next = page < totalPages 
      ? `${baseUrl}?page=${page + 1}&limit=${limit}` 
      : null;
    const previous = page > 1 
      ? `${baseUrl}?page=${page - 1}&limit=${limit}` 
      : null;

    return {
      count,
      next,
      previous,
      total_pages: totalPages,
      current_page: page,
      results,
    };
  }
}