export interface HttpResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedHttpResponse<T> {
  success: boolean;
  items: T[];
  total: number;
  page: number;
  limit: number;
}

