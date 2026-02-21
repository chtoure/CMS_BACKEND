
class Paginator {
  static async paginate<T>(
    model: any,
    options: {
      page?: number | undefined;
      limit?: number | undefined;
      where?: object;
      orderBy?: object;
      include?: object;
    }
  ): Promise<{ results: T[]; count: number; total_pages: number; current_page: number }> {
    const { page, limit, where = {}, orderBy = { createdAt: 'desc' }, include } = options;

    const isPaginated = page !== undefined && limit !== undefined;
    const skip = isPaginated ? (page - 1) * limit : undefined;
    const take: number | undefined= isPaginated ? limit : undefined;

    console.log('take number', typeof take);
    

    const [results, count] = await Promise.all([
      model.findMany({
        where,
        skip,
        take,
        orderBy,
        include
      }),
      model.count({ where }),
    ]);

    return {
      count,
      total_pages: isPaginated ? Math.ceil(count / limit!) : 1,
      current_page: page || 1,
      results: results as T[],
    };
  }
}


export {Paginator}