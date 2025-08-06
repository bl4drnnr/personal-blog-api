export interface GetAdminProjectsInterface {
  userId: string;
  published?: string;
  query?: string;
  page?: number;
  pageSize?: number;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
}
