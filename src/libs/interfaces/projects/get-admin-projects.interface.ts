export interface GetAdminProjectsInterface {
  userId: string;
  page: string;
  pageSize: string;
  order: string;
  published?: string;
  query?: string;
  orderBy?: string;
}
