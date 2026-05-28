import { Request } from 'express';

/**
 * Pagination helper — extracts page/limit from query params,
 * calculates skip, and provides metadata for responses.
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPagination = (req: Request, defaultLimit = 20, maxLimit = 100): PaginationOptions => {
  let page = parseInt(req.query.page as string, 10) || 1;
  let limit = parseInt(req.query.limit as string, 10) || defaultLimit;

  // Clamp values
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const getPaginationMeta = (total: number, options: PaginationOptions): PaginationMeta => {
  return {
    page: options.page,
    limit: options.limit,
    total,
    totalPages: Math.ceil(total / options.limit),
  };
};
