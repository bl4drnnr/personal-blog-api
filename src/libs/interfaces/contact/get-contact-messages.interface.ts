export interface GetContactMessagesInterface {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  query?: string;
  status?: string;
}
