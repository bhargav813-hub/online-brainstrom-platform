import { Response } from 'express';

/**
 * Standardized API response wrapper.
 * Ensures consistent JSON structure across all endpoints.
 */
export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: { page: number; limit: number; total: number; totalPages: number },
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(res: Response, statusCode: number, message: string, errors: any[] = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
