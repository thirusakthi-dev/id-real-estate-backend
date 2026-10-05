export interface PaginationOptions {
  page: number;
  limit: number;
}

export function getPagination(options: PaginationOptions) {
  const { page, limit } = options;

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function getPaginationResponse(
  page: number,
  limit: number,
  total: number,
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
